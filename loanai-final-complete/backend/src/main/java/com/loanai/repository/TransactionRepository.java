package com.loanai.repository;

import com.loanai.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {

    List<Transaction> findByAccountNumberOrderByTransactionDateDesc(String accountNumber);

    @Query("SELECT t FROM Transaction t WHERE t.accountNumber IN " +
            "(SELECT a.accountNumber FROM Account a WHERE a.cifNumber = ?1) " +
            "ORDER BY t.transactionDate DESC")
    List<Transaction> findByCifNumberOrderByDateDesc(String cifNumber);
}
