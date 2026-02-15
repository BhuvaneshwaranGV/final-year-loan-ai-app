package com.loanai.service;

import com.loanai.model.LoanApplication;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FraudDetectionService {

    /**
     * Detect 9 fraud patterns
     * Returns fraud score (0-10) and list of detected frauds
     */
    public Map<String, Object> detectFraud(LoanApplication app, Map<String, Object> transactionData) {

        List<String> fraudFlags = new ArrayList<>();
        int fraudScore = 0;

        // 1. AGE-EMPLOYMENT MISMATCH
        if (app.getEmploymentYears() != null && app.getAge() != null) {
            if (app.getEmploymentYears() > (app.getAge() - 18)) {
                fraudFlags.add("AGE_EMPLOYMENT_MISMATCH");
                fraudScore += 3;
            }
        }

        // 2. FAKE SALARY (from transaction analysis)
        if (transactionData != null) {
            Integer salaryCount = (Integer) transactionData.get("salary_count");
            if (salaryCount != null && salaryCount < 6) {
                fraudFlags.add("IRREGULAR_SALARY_PATTERN");
                fraudScore += 2;
            }
        }

        // 3. EXCESSIVE CASH (from transaction analysis)
        if (transactionData != null) {
            BigDecimal cashDep = toBigDecimal(transactionData.get("cash_dependency"));
            if (cashDep != null && cashDep.compareTo(new BigDecimal("0.30")) > 0) {
                fraudFlags.add("EXCESSIVE_CASH_TRANSACTIONS");
                fraudScore += 2;
            }
        }

        // 4. HIGH FOIR
        if (app.getFoir() != null && app.getFoir().compareTo(new BigDecimal("70")) > 0) {
            fraudFlags.add("EXCESSIVE_FOIR");
            fraudScore += 2;
        }

        // 5. INCOME-LOAN MISMATCH
        if (app.getMonthlyIncome() != null && app.getLoanAmount() != null) {
            BigDecimal ratio = app.getLoanAmount().divide(app.getMonthlyIncome(), 2, java.math.RoundingMode.HALF_UP);
            if (ratio.compareTo(new BigDecimal("60")) > 0) {
                fraudFlags.add("INCOME_LOAN_MISMATCH");
                fraudScore += 3;
            }
        }

        // 6. LOW AVERAGE BALANCE (from transaction analysis)
        if (transactionData != null && app.getLoanAmount() != null) {
            BigDecimal avgBalance = toBigDecimal(transactionData.get("avg_balance"));
            if (avgBalance != null &&
                    app.getLoanAmount().compareTo(new BigDecimal("500000")) > 0 &&
                    avgBalance.compareTo(new BigDecimal("10000")) < 0) {
                fraudFlags.add("LOW_AVERAGE_BALANCE");
                fraudScore += 2;
            }
        }

        // 7. FRAUD TRANSACTIONS (from transaction analysis)
        if (transactionData != null) {
            Integer fraudCount = (Integer) transactionData.get("fraud_count");
            if (fraudCount != null && fraudCount > 0) {
                fraudFlags.add("HISTORICAL_FRAUD_FLAGS");
                fraudScore += 3;
            }
        }

        // 8. SUSPICIOUS PATTERN (combined indicators)
        if (fraudFlags.size() >= 3) {
            fraudFlags.add("MULTIPLE_RED_FLAGS");
            fraudScore += 1;
        }

        // Determine risk level
        String riskLevel;
        if (fraudScore >= 5) {
            riskLevel = "HIGH";
        } else if (fraudScore >= 3) {
            riskLevel = "MEDIUM";
        } else {
            riskLevel = "LOW";
        }

        Map<String, Object> result = new HashMap<>();
        result.put("fraud_score", fraudScore);
        result.put("fraud_flags", fraudFlags);
        result.put("fraud_risk", riskLevel);

        return result;
    }

    private BigDecimal toBigDecimal(Object o) {
        if (o == null)
            return null;
        if (o instanceof BigDecimal)
            return (BigDecimal) o;
        return new BigDecimal(o.toString());
    }
}
