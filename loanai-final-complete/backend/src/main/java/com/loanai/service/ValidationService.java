package com.loanai.service;

import com.loanai.model.LoanApplication;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ValidationService {

    /**
     * Validate loan application
     * Returns validation errors and warnings
     */
    public Map<String, Object> validateApplication(LoanApplication app) {

        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();

        // 1. AGE-EMPLOYMENT VALIDATION (YOUR FIX!)
        if (app.getEmploymentYears() != null && app.getAge() != null) {
            int maxPossibleYears = app.getAge() - 18;
            if (app.getEmploymentYears() > maxPossibleYears) {
                errors.add(String.format(
                        "Employment years (%d) cannot exceed %d years for age %d. " +
                                "This indicates impossible work experience.",
                        app.getEmploymentYears(), maxPossibleYears, app.getAge()));
            }
        }

        // 2. FOIR CALCULATION (YOUR FIX!)
        if (app.getMonthlyIncome() != null && app.getLoanAmount() != null) {
            BigDecimal monthlyEMI = calculateEMI(
                    app.getLoanAmount(),
                    app.getTenureYears() != null ? app.getTenureYears() : 20,
                    10.0 // 10% interest rate assumption
            );

            BigDecimal existingEMI = BigDecimal.ZERO;
            if (app.getExistingDebt() != null) {
                existingEMI = app.getExistingDebt().divide(
                        new BigDecimal("24"), 2, RoundingMode.HALF_UP);
            }

            BigDecimal totalEMI = monthlyEMI.add(existingEMI);
            BigDecimal foir = totalEMI.divide(app.getMonthlyIncome(), 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));

            app.setFoir(foir);
            app.setCalculatedEmi(monthlyEMI);

            if (foir.compareTo(new BigDecimal("50")) > 0) {
                errors.add(String.format(
                        "FOIR %.2f%% exceeds safe limit of 50%%. " +
                                "Monthly obligations (₹%.2f) are too high relative to income (₹%.2f).",
                        foir, totalEMI, app.getMonthlyIncome()));
            } else if (foir.compareTo(new BigDecimal("40")) > 0) {
                warnings.add(String.format(
                        "FOIR %.2f%% is moderately high. Consider reducing loan amount.",
                        foir));
            }
        }

        // 3. EDUCATION LOAN GUARANTOR (YOUR FIX!)
        if ("EDUCATION".equals(app.getLoanPurpose()) &&
                app.getLoanAmount().compareTo(new BigDecimal("750000")) > 0) {
            // Need guarantor for education loans > 7.5L
            // This should be checked in frontend, but validate here too
            warnings.add("Education loans above ₹7.5L require a guarantor.");
        }

        // 4. RETIREMENT AGE CHECK (YOUR FIX!)
        if (app.getAge() != null && app.getTenureYears() != null) {
            int ageAtLoanEnd = app.getAge() + app.getTenureYears();
            if (ageAtLoanEnd > 60) {
                warnings.add(String.format(
                        "Loan tenure extends beyond retirement age (60). " +
                                "You'll be %d years old at loan completion.",
                        ageAtLoanEnd));
            }
        }

        // 5. MINIMUM AGE
        if (app.getAge() != null && app.getAge() < 18) {
            errors.add("Applicant must be at least 18 years old.");
        }

        // 6. LOAN AMOUNT REASONABLENESS
        if (app.getMonthlyIncome() != null && app.getLoanAmount() != null) {
            BigDecimal ratio = app.getLoanAmount().divide(
                    app.getMonthlyIncome(), 2, RoundingMode.HALF_UP);

            if (ratio.compareTo(new BigDecimal("60")) > 0) {
                warnings.add(String.format(
                        "Loan amount is %.1fx your monthly income. This may trigger fraud detection.",
                        ratio));
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("valid", errors.isEmpty());
        result.put("errors", errors);
        result.put("warnings", warnings);
        result.put("foir", app.getFoir());
        result.put("calculatedEmi", app.getCalculatedEmi());

        return result;
    }

    /**
     * Calculate EMI
     */
    private BigDecimal calculateEMI(BigDecimal principal, int years, double rate) {
        if (principal == null || years <= 0) {
            return BigDecimal.ZERO;
        }

        double P = principal.doubleValue();
        double r = rate / 12 / 100;
        int n = years * 12;

        double emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

        return new BigDecimal(emi).setScale(2, RoundingMode.HALF_UP);
    }
}
