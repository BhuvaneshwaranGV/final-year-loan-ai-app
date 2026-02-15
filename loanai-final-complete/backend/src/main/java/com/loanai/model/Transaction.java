package com.loanai.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "transaction_history")
@Data
public class Transaction {

    @Id
    @Column(name = "transaction_id")
    private String transactionId;

    @Column(name = "account_number")
    private String accountNumber;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "transaction_date")
    private LocalDate transactionDate;

    @Column(name = "value_date")
    private LocalDate valueDate;

    @Column(name = "txn_reference_number")
    private String txnReferenceNumber;

    @Column(columnDefinition = "TEXT")
    private String narration;

    @Column(name = "cheque_number")
    private String chequeNumber;

    @Column(name = "debit_amount")
    private BigDecimal debitAmount;

    @Column(name = "credit_amount")
    private BigDecimal creditAmount;

    @Column(name = "balance_after")
    private BigDecimal balanceAfter;

    private String channel;

    @Column(name = "counterparty_name")
    private String counterpartyName;

    @Column(name = "counterparty_bank")
    private String counterpartyBank;

    @Column(name = "counterparty_ifsc")
    private String counterpartyIfsc;

    @Column(name = "fraud_flag")
    private Integer fraudFlag;

    @Column(name = "fraud_type")
    private String fraudType;
}
