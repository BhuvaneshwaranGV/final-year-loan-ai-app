package com.loanai.service;

import com.loanai.model.LoanApplication;
import com.loanai.repository.LoanApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@Service
public class LoanApplicationService {

    private final LoanApplicationRepository loanRepository;
    private final ValidationService validationService;
    private final FraudDetectionService fraudDetectionService;
    private final RestTemplate restTemplate;

    public LoanApplicationService(LoanApplicationRepository loanRepository, ValidationService validationService,
            FraudDetectionService fraudDetectionService, RestTemplate restTemplate) {
        this.loanRepository = loanRepository;
        this.validationService = validationService;
        this.fraudDetectionService = fraudDetectionService;
        this.restTemplate = restTemplate;
    }

    private static final String ML_SERVICE_URL = "http://localhost:5000";

    /**
     * Process loan application
     * STORES ALL APPLICATIONS - APPROVED AND REJECTED
     */
    public LoanApplication processApplication(LoanApplication app) {

        System.out.println("📝 Processing loan application for: " + app.getEmail());

        app.setStatus("PROCESSING");
        app.setAppliedAt(LocalDateTime.now());

        // 1. Validate business rules
        Map<String, Object> validation = validationService.validateApplication(app);

        if (!(Boolean) validation.get("valid")) {
            // Validation failed - REJECT and STORE
            app.setDecision("REJECTED");
            app.setStatus("PROCESSED");
            app.setPrimaryRejectionReason("Validation failed");
            app.setRejectionReason(validation.get("errors").toString());
            app.setProcessedAt(LocalDateTime.now());

            return loanRepository.save(app); // STORED!
        }

        // 2. Call ML service for transaction analysis + prediction
        try {
            Map<String, Object> mlRequest = new HashMap<>();
            mlRequest.put("cif_number", app.getCifNumber());
            mlRequest.put("age", app.getAge());
            mlRequest.put("monthly_income", app.getMonthlyIncome());
            mlRequest.put("employment_years", app.getEmploymentYears());
            mlRequest.put("loan_amount", app.getLoanAmount());
            mlRequest.put("existing_debt", app.getExistingDebt());
            mlRequest.put("foir", app.getFoir());

            System.out.println("🤖 Calling ML service...");

            @SuppressWarnings("unchecked")
            Map<String, Object> mlResponse = (Map<String, Object>) restTemplate.postForObject(
                    ML_SERVICE_URL + "/predict",
                    mlRequest,
                    Map.class);

            if (mlResponse != null) {
                // Extract ML results
                app.setRiskScore(((Number) mlResponse.get("risk_score")).intValue());
                app.setRiskCategory((String) mlResponse.get("risk_category"));
                app.setApprovalProbability(new java.math.BigDecimal(mlResponse.get("approval_probability").toString()));
                app.setRecommendedInterestRate(
                        new java.math.BigDecimal(mlResponse.get("recommended_interest_rate").toString()));
                app.setDecision((String) mlResponse.get("decision"));

                // Transaction analysis
                Map<String, Object> txnData = new HashMap<>(); // Default empty
                if (mlResponse.containsKey("transaction_analysis")) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> txnDataCast = (Map<String, Object>) mlResponse.get("transaction_analysis");
                    txnData = txnDataCast;
                    app.setSimulatedCibil(((Number) txnData.get("simulated_cibil")).intValue());
                    app.setSalaryCreditCount(((Number) txnData.getOrDefault("salary_count", 0)).intValue());

                    if (txnData.get("savings_rate") != null) {
                        app.setSavingsRate(new java.math.BigDecimal(txnData.get("savings_rate").toString()));
                    }
                    if (txnData.get("avg_balance") != null) {
                        app.setAvgBalance(new java.math.BigDecimal(txnData.get("avg_balance").toString()));
                    }
                }

                // Fraud detection (ML + Rule-based)
                Map<String, Object> localFraudResult = fraudDetectionService.detectFraud(app, txnData);

                int mlFraudScore = 0;
                if (mlResponse.containsKey("fraud_detection")) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> fraudData = (Map<String, Object>) mlResponse.get("fraud_detection");
                    mlFraudScore = ((Number) fraudData.get("fraud_score")).intValue();
                }

                // Combine scores (Max of ML or Rule-based)
                int localFraudScore = (int) localFraudResult.get("fraud_score");
                int finalFraudScore = Math.max(mlFraudScore, localFraudScore);

                app.setFraudScore(finalFraudScore);

                // Combine flags
                @SuppressWarnings("unchecked")
                List<String> combinedFlags = (List<String>) localFraudResult.get("fraud_flags");
                app.setFraudFlags(combinedFlags.toString());
            }

        } catch (Exception e) {
            System.err.println("✗ ML service error: " + e.getMessage());
            // Fallback decision
            app.setDecision("MANUAL_REVIEW");
            app.setStatus("MANUAL_REVIEW_PENDING");
        }

        // 3. Set final status
        if ("MANUAL_REVIEW".equals(app.getDecision())) {
            app.setStatus("MANUAL_REVIEW_PENDING");
        } else {
            app.setStatus("PROCESSED");
        }

        app.setProcessedAt(LocalDateTime.now());

        // 4. SAVE TO DATABASE (approved AND rejected!)
        LoanApplication saved = loanRepository.save(app);

        System.out.println("✓ Application " + saved.getApplicationId() + " - " + saved.getDecision());

        return saved;
    }

    /**
     * Admin override decision
     */
    public LoanApplication adminOverride(Long id, String decision, String reviewerName, String comments) {
        java.util.Objects.requireNonNull(id, "ID cannot be null");
        LoanApplication app = loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        app.setOriginalDecision(app.getDecision());
        app.setDecision(decision);
        app.setReviewedBy(reviewerName);
        app.setReviewedAt(LocalDateTime.now());
        app.setReviewComments(comments);
        app.setStatus("PROCESSED");

        return loanRepository.save(app);
    }
}
