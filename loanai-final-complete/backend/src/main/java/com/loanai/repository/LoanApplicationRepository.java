package com.loanai.repository;

import com.loanai.model.LoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {

    List<LoanApplication> findByEmail(String email);

    List<LoanApplication> findByCifNumber(String cifNumber);

    List<LoanApplication> findByStatus(String status);

    List<LoanApplication> findByDecision(String decision);

    @Query("SELECT l FROM LoanApplication l WHERE l.status = 'MANUAL_REVIEW_PENDING' ORDER BY l.appliedAt DESC")
    List<LoanApplication> findPendingManualReview();

    @Query("SELECT COUNT(l) FROM LoanApplication l WHERE l.decision = 'APPROVED'")
    Long countApproved();

    @Query("SELECT COUNT(l) FROM LoanApplication l WHERE l.decision = 'REJECTED'")
    Long countRejected();
}
