package com.loanai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @PostMapping("/send")
    public ResponseEntity<?> chat(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        String response = "I am a simple LoanAI assistant. I can help you with loan status or general FAQs. (Integration pending)";

        if (message.toLowerCase().contains("loan")) {
            response = "You can apply for a loan in the 'Apply Loan' section. We offer competitive rates starting at 8%.";
        } else if (message.toLowerCase().contains("status")) {
            response = "You can track your application status in the 'Track' section.";
        } else if (message.toLowerCase().contains("fraud")) {
            response = "If you suspect fraud, please visit the Fraud Detection page immediately.";
        }

        return ResponseEntity.ok(Map.of("response", response));
    }
}
