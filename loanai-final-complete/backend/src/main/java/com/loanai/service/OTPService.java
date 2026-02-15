package com.loanai.service;

import com.loanai.model.OTPRecord;
import com.loanai.repository.OTPRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class OTPService {

    private final OTPRepository otpRepository;
    private final JavaMailSender mailSender;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public OTPService(OTPRepository otpRepository, JavaMailSender mailSender) {
        this.otpRepository = otpRepository;
        this.mailSender = mailSender;
    }

    /**
     * Generate and send OTP to email from FORM (not database)
     * Also prints to console
     * 2-minute expiry
     */
    public Map<String, Object> sendOTP(String accountNumber, String emailFromForm) {

        // Generate 6-digit OTP
        String otp = generateOTP();

        // Create OTP record
        OTPRecord record = new OTPRecord();
        record.setAccountNumber(accountNumber);
        record.setEmail(emailFromForm);
        record.setOtpHash(passwordEncoder.encode(otp));
        record.setExpiresAt(LocalDateTime.now().plusMinutes(2)); // 2 MINUTE EXPIRY
        record.setVerified(false);
        record.setAttempts(0);

        otpRepository.save(record);

        // Print to CONSOLE (for demo)
        printOTPToConsole(otp, accountNumber, emailFromForm);

        // Send to EMAIL
        sendOTPEmail(emailFromForm, otp, accountNumber);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "OTP sent to " + emailFromForm + " and printed in console");
        response.put("email", emailFromForm);
        response.put("expiresIn", "2 minutes");

        return response;
    }

    /**
     * Verify OTP
     */
    public Map<String, Object> verifyOTP(String accountNumber, String inputOTP) {

        // Find latest OTP for this account
        Optional<OTPRecord> recordOpt = otpRepository
                .findTopByAccountNumberAndVerifiedFalseOrderByCreatedAtDesc(accountNumber);

        if (recordOpt.isEmpty()) {
            return Map.of(
                    "success", false,
                    "message", "No OTP found for this account");
        }

        OTPRecord record = recordOpt.get();

        // Check expiry
        if (LocalDateTime.now().isAfter(record.getExpiresAt())) {
            return Map.of(
                    "success", false,
                    "message", "OTP expired. Please request a new one.");
        }

        // Check attempts
        record.setAttempts(record.getAttempts() + 1);

        if (record.getAttempts() > 3) {
            otpRepository.save(record);
            return Map.of(
                    "success", false,
                    "message", "Too many attempts. Please request a new OTP.");
        }

        // Verify OTP
        if (!passwordEncoder.matches(inputOTP, record.getOtpHash())) {
            otpRepository.save(record);
            return Map.of(
                    "success", false,
                    "message", "Invalid OTP",
                    "attemptsRemaining", 3 - record.getAttempts());
        }

        // Success
        record.setVerified(true);
        otpRepository.save(record);

        return Map.of(
                "success", true,
                "message", "OTP verified successfully",
                "email", record.getEmail());
    }

    /**
     * Generate 6-digit OTP
     */
    private String generateOTP() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    /**
     * Print OTP to console for demo
     */
    private void printOTPToConsole(String otp, String accountNumber, String email) {
        System.out.println("\n═══════════════════════════════════════");
        System.out.println("🔐 OTP GENERATED (DEMO)");
        System.out.println("═══════════════════════════════════════");
        System.out.println("Account: " + accountNumber);
        System.out.println("Email (from form): " + email);
        System.out.println("OTP: " + otp);
        System.out.println("Expires: " + LocalDateTime.now().plusMinutes(2));
        System.out.println("Valid for: 2 minutes");
        System.out.println("═══════════════════════════════════════\n");
    }

    /**
     * Send OTP email
     */
    private void sendOTPEmail(String toEmail, String otp, String accountNumber) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@loanai.com");
            message.setTo(toEmail);
            message.setSubject("LoanAI - Your OTP for Loan Application");
            message.setText(String.format(
                    "Dear Customer,\n\n" +
                            "Your One-Time Password (OTP) is: %s\n\n" +
                            "This OTP is valid for 2 minutes only.\n\n" +
                            "Account Number: %s\n" +
                            "Generated at: %s\n\n" +
                            "Do not share this OTP with anyone.\n\n" +
                            "Best regards,\n" +
                            "LoanAI Team",
                    otp,
                    accountNumber,
                    LocalDateTime.now()));

            mailSender.send(message);
            System.out.println("✓ OTP email sent to: " + toEmail);

        } catch (Exception e) {
            System.err.println("✗ Failed to send email: " + e.getMessage());
            System.out.println("  (OTP is still valid in console)");
        }
    }
}
