package com.loanai.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fraud_statistics")
@Data
public class FraudStatistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stat_id")
    private Long statId;

    @Column(name = "fraud_pattern", length = 100)
    private String fraudPattern;

    @Column(name = "detection_count")
    private Integer detectionCount = 0;

    @Column(name = "amount_prevented")
    private BigDecimal amountPrevented = BigDecimal.ZERO;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }
}
