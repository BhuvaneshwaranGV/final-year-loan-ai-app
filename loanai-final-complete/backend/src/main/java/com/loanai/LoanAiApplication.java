package com.loanai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LoanAiApplication {
    
    public static void main(String[] args) {
        System.out.println("═══════════════════════════════════════════════════");
        System.out.println("🚀 LoanAI System Starting...");
        System.out.println("═══════════════════════════════════════════════════");
        System.out.println("Features:");
        System.out.println("  ✓ PostgreSQL Database (loan_system)");
        System.out.println("  ✓ Login with users table");
        System.out.println("  ✓ OTP to email + console (2 min expiry)");
        System.out.println("  ✓ Transaction analysis (1.2M records)");
        System.out.println("  ✓ Simulated CIBIL generation");
        System.out.println("  ✓ 9-pattern fraud detection");
        System.out.println("  ✓ XGBoost ML prediction");
        System.out.println("  ✓ Admin override");
        System.out.println("  ✓ Store ALL applications (approved + rejected)");
        System.out.println("═══════════════════════════════════════════════════");
        
        SpringApplication.run(LoanAiApplication.class, args);
        
        System.out.println("\n✓ LoanAI Backend Started Successfully!");
        System.out.println("API available at: http://localhost:8080");
        System.out.println("═══════════════════════════════════════════════════\n");
    }
}
