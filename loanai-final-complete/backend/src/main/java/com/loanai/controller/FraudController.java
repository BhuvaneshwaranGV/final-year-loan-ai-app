package com.loanai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fraud")
@CrossOrigin(origins = "*")
public class FraudController {

    private final JdbcTemplate jdbcTemplate;

    public FraudController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getFraudStats() {
        // Query transaction_history for fraud flags
        String sql = "SELECT COUNT(*) as count, fraud_type FROM transaction_history WHERE fraud_flag = true GROUP BY fraud_type";

        List<Map<String, Object>> fraudStats = jdbcTemplate.queryForList(sql);

        Integer totalFraud = jdbcTemplate
                .queryForObject("SELECT COUNT(*) FROM transaction_history WHERE fraud_flag = true", Integer.class);
        if (totalFraud == null)
            totalFraud = 0;

        return ResponseEntity.ok(Map.of(
                "total_fraud_detected", totalFraud,
                "patterns", fraudStats,
                "prevented_value", "₹ 45,20,000" // Placeholder static value as database might not have amounts for
                                                 // prevented frauds
        ));
    }
}
