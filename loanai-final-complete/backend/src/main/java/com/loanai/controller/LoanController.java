package com.loanai.controller;

import com.loanai.model.LoanApplication;
import com.loanai.repository.LoanApplicationRepository;
import com.loanai.service.LoanApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loan")
@CrossOrigin(origins = "*")
public class LoanController {

    private final LoanApplicationService loanService;
    private final LoanApplicationRepository loanRepository;

    public LoanController(LoanApplicationService loanService, LoanApplicationRepository loanRepository) {
        this.loanService = loanService;
        this.loanRepository = loanRepository;
    }

    /**
     * Submit loan application
     * Returns complete application with ML results
     * STORES ALL APPLICATIONS (approved AND rejected)
     */
    @PostMapping("/apply")
    public ResponseEntity<?> applyLoan(@RequestBody LoanApplication application) {
        try {
            LoanApplication processed = loanService.processApplication(application);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("application", processed);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error processing application: " + e.getMessage()));
        }
    }

    /**
     * Get application by ID
     */
    @GetMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<?> getApplication(@PathVariable Long id) {
        return loanRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Track applications by email or ID
     */
    @GetMapping("/track")
    public ResponseEntity<?> trackApplications(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) Long id) {
        if (id != null) {
            return loanRepository.findById(id)
                    .map(app -> ResponseEntity.ok(List.of(app)))
                    .orElse(ResponseEntity.ok(List.of()));
        }

        if (email != null) {
            return ResponseEntity.ok(loanRepository.findByEmail(email));
        }

        return ResponseEntity.ok(loanRepository.findAll());
    }

    /**
     * Get dashboard statistics
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        long total = loanRepository.count();
        long approved = loanRepository.countApproved();
        long rejected = loanRepository.countRejected();
        long pending = loanRepository.findPendingManualReview().size();

        Map<String, Object> stats = Map.of(
                "total", total,
                "approved", approved,
                "rejected", rejected,
                "pending_review", pending,
                "approval_rate", total > 0 ? (double) approved / total * 100 : 0);

        return ResponseEntity.ok(stats);
    }
}
