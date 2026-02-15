package com.loanai.controller;

import com.loanai.model.LoanApplication;
import com.loanai.repository.LoanApplicationRepository;
import com.loanai.service.LoanApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final LoanApplicationService loanService;
    private final LoanApplicationRepository loanRepository;

    public AdminController(LoanApplicationService loanService, LoanApplicationRepository loanRepository) {
        this.loanService = loanService;
        this.loanRepository = loanRepository;
    }

    /**
     * Get applications pending manual review
     */
    @GetMapping("/pending-reviews")
    public ResponseEntity<?> getPendingReviews() {
        List<LoanApplication> pending = loanRepository.findPendingManualReview();
        return ResponseEntity.ok(pending);
    }

    /**
     * Admin approve/reject with override
     */
    @PutMapping("/loans/{id}/decision")
    public ResponseEntity<?> adminDecision(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            String decision = request.get("decision");
            String reviewerName = request.get("reviewerName");
            String comments = request.get("comments");

            LoanApplication updated = loanService.adminOverride(id, decision, reviewerName, comments);

            return ResponseEntity.ok(updated);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error: " + e.getMessage()));
        }
    }

    /**
     * Get all applications
     */
    @GetMapping("/applications")
    public ResponseEntity<?> getAllApplications(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String decision) {
        if (status != null) {
            return ResponseEntity.ok(loanRepository.findByStatus(status));
        }
        if (decision != null) {
            return ResponseEntity.ok(loanRepository.findByDecision(decision));
        }
        return ResponseEntity.ok(loanRepository.findAll());
    }
}
