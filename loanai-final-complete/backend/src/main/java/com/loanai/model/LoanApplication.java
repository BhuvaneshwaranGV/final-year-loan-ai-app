package com.loanai.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "loan_applications")
@Data
public class LoanApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long applicationId;

    // Customer Info
    @Column(name = "cif_number")
    private String cifNumber;

    @Column(name = "account_number")
    private String accountNumber;

    @Column(name = "applicant_name")
    private String applicantName;

    @Column(nullable = false)
    private String email;

    private String phone;

    // Personal Info
    private Integer age;

    @Column(name = "marital_status")
    private String maritalStatus;

    private Integer dependents;

    @Column(name = "education_level")
    private String educationLevel;

    // Financial Info
    @Column(name = "monthly_income")
    private BigDecimal monthlyIncome;

    @Column(name = "employment_years")
    private Integer employmentYears;

    @Column(name = "employment_type")
    private String employmentType;

    @Column(name = "credit_score")
    private Integer creditScore;

    @Column(name = "existing_debt")
    private BigDecimal existingDebt;

    @Column(name = "has_property")
    private Boolean hasProperty;

    // Loan Details
    @Column(name = "loan_amount", nullable = false)
    private BigDecimal loanAmount;

    @Column(name = "loan_purpose")
    private String loanPurpose;

    @Column(name = "tenure_years")
    private Integer tenureYears;

    // Calculated Fields
    private BigDecimal foir;

    @Column(name = "calculated_emi")
    private BigDecimal calculatedEmi;

    // Transaction Analysis
    @Column(name = "simulated_cibil")
    private Integer simulatedCibil;

    @Column(name = "salary_credit_count")
    private Integer salaryCreditCount;

    @Column(name = "savings_rate")
    private BigDecimal savingsRate;

    @Column(name = "avg_balance")
    private BigDecimal avgBalance;

    @Column(name = "fraud_transaction_count")
    private Integer fraudTransactionCount;

    @Column(name = "cash_dependency_rate")
    private BigDecimal cashDependencyRate;

    // ML Results
    @Column(name = "risk_score")
    private Integer riskScore;

    @Column(name = "risk_category")
    private String riskCategory;

    @Column(name = "approval_probability")
    private BigDecimal approvalProbability;

    @Column(name = "recommended_interest_rate")
    private BigDecimal recommendedInterestRate;

    // DECISION - stores APPROVED and REJECTED
    @Column(nullable = false)
    private String decision;

    @Column(nullable = false)
    private String status = "PENDING";

    // Fraud Detection
    @Column(name = "fraud_score")
    private Integer fraudScore;

    @Column(name = "fraud_flags", columnDefinition = "TEXT")
    private String fraudFlags;

    // Rejection Details
    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "primary_rejection_reason")
    private String primaryRejectionReason;

    @Column(name = "improvement_suggestions", columnDefinition = "TEXT")
    private String improvementSuggestions;

    // Admin Review
    @Column(name = "reviewed_by")
    private String reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "review_comments", columnDefinition = "TEXT")
    private String reviewComments;

    @Column(name = "original_decision")
    private String originalDecision;

    // Timestamps
    @Column(name = "applied_at")
    private LocalDateTime appliedAt;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @PrePersist
    protected void onCreate() {
        appliedAt = LocalDateTime.now();
        if (status == null) {
            status = "PENDING";
        }
    }

    // Manually added Getters and Setters
    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public String getCifNumber() {
        return cifNumber;
    }

    public void setCifNumber(String cifNumber) {
        this.cifNumber = cifNumber;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getMaritalStatus() {
        return maritalStatus;
    }

    public void setMaritalStatus(String maritalStatus) {
        this.maritalStatus = maritalStatus;
    }

    public Integer getDependents() {
        return dependents;
    }

    public void setDependents(Integer dependents) {
        this.dependents = dependents;
    }

    public String getEducationLevel() {
        return educationLevel;
    }

    public void setEducationLevel(String educationLevel) {
        this.educationLevel = educationLevel;
    }

    public BigDecimal getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(BigDecimal monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public Integer getEmploymentYears() {
        return employmentYears;
    }

    public void setEmploymentYears(Integer employmentYears) {
        this.employmentYears = employmentYears;
    }

    public String getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(String employmentType) {
        this.employmentType = employmentType;
    }

    public Integer getCreditScore() {
        return creditScore;
    }

    public void setCreditScore(Integer creditScore) {
        this.creditScore = creditScore;
    }

    public BigDecimal getExistingDebt() {
        return existingDebt;
    }

    public void setExistingDebt(BigDecimal existingDebt) {
        this.existingDebt = existingDebt;
    }

    public Boolean getHasProperty() {
        return hasProperty;
    }

    public void setHasProperty(Boolean hasProperty) {
        this.hasProperty = hasProperty;
    }

    public BigDecimal getLoanAmount() {
        return loanAmount;
    }

    public void setLoanAmount(BigDecimal loanAmount) {
        this.loanAmount = loanAmount;
    }

    public String getLoanPurpose() {
        return loanPurpose;
    }

    public void setLoanPurpose(String loanPurpose) {
        this.loanPurpose = loanPurpose;
    }

    public Integer getTenureYears() {
        return tenureYears;
    }

    public void setTenureYears(Integer tenureYears) {
        this.tenureYears = tenureYears;
    }

    public BigDecimal getFoir() {
        return foir;
    }

    public void setFoir(BigDecimal foir) {
        this.foir = foir;
    }

    public BigDecimal getCalculatedEmi() {
        return calculatedEmi;
    }

    public void setCalculatedEmi(BigDecimal calculatedEmi) {
        this.calculatedEmi = calculatedEmi;
    }

    public Integer getSimulatedCibil() {
        return simulatedCibil;
    }

    public void setSimulatedCibil(Integer simulatedCibil) {
        this.simulatedCibil = simulatedCibil;
    }

    public Integer getSalaryCreditCount() {
        return salaryCreditCount;
    }

    public void setSalaryCreditCount(Integer salaryCreditCount) {
        this.salaryCreditCount = salaryCreditCount;
    }

    public BigDecimal getSavingsRate() {
        return savingsRate;
    }

    public void setSavingsRate(BigDecimal savingsRate) {
        this.savingsRate = savingsRate;
    }

    public BigDecimal getAvgBalance() {
        return avgBalance;
    }

    public void setAvgBalance(BigDecimal avgBalance) {
        this.avgBalance = avgBalance;
    }

    public Integer getFraudTransactionCount() {
        return fraudTransactionCount;
    }

    public void setFraudTransactionCount(Integer fraudTransactionCount) {
        this.fraudTransactionCount = fraudTransactionCount;
    }

    public BigDecimal getCashDependencyRate() {
        return cashDependencyRate;
    }

    public void setCashDependencyRate(BigDecimal cashDependencyRate) {
        this.cashDependencyRate = cashDependencyRate;
    }

    public Integer getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(Integer riskScore) {
        this.riskScore = riskScore;
    }

    public String getRiskCategory() {
        return riskCategory;
    }

    public void setRiskCategory(String riskCategory) {
        this.riskCategory = riskCategory;
    }

    public BigDecimal getApprovalProbability() {
        return approvalProbability;
    }

    public void setApprovalProbability(BigDecimal approvalProbability) {
        this.approvalProbability = approvalProbability;
    }

    public BigDecimal getRecommendedInterestRate() {
        return recommendedInterestRate;
    }

    public void setRecommendedInterestRate(BigDecimal recommendedInterestRate) {
        this.recommendedInterestRate = recommendedInterestRate;
    }

    public String getDecision() {
        return decision;
    }

    public void setDecision(String decision) {
        this.decision = decision;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getFraudScore() {
        return fraudScore;
    }

    public void setFraudScore(Integer fraudScore) {
        this.fraudScore = fraudScore;
    }

    public String getFraudFlags() {
        return fraudFlags;
    }

    public void setFraudFlags(String fraudFlags) {
        this.fraudFlags = fraudFlags;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public String getPrimaryRejectionReason() {
        return primaryRejectionReason;
    }

    public void setPrimaryRejectionReason(String primaryRejectionReason) {
        this.primaryRejectionReason = primaryRejectionReason;
    }

    public String getImprovementSuggestions() {
        return improvementSuggestions;
    }

    public void setImprovementSuggestions(String improvementSuggestions) {
        this.improvementSuggestions = improvementSuggestions;
    }

    public String getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(String reviewedBy) {
        this.reviewedBy = reviewedBy;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public String getReviewComments() {
        return reviewComments;
    }

    public void setReviewComments(String reviewComments) {
        this.reviewComments = reviewComments;
    }

    public String getOriginalDecision() {
        return originalDecision;
    }

    public void setOriginalDecision(String originalDecision) {
        this.originalDecision = originalDecision;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

    public LocalDateTime getProcessedAt() {
        return processedAt;
    }

    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }
}
