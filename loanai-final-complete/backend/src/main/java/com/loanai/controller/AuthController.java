package com.loanai.controller;

import com.loanai.model.Account;
import com.loanai.model.Customer;
import com.loanai.repository.AccountRepository;
import com.loanai.repository.CustomerRepository;
import com.loanai.service.AuthService;
import com.loanai.service.OTPService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final OTPService otpService;
    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;

    public AuthController(AuthService authService, OTPService otpService, AccountRepository accountRepository,
            CustomerRepository customerRepository) {
        this.authService = authService;
        this.otpService = otpService;
        this.accountRepository = accountRepository;
        this.customerRepository = customerRepository;
    }

    /**
     * Login endpoint with validation
     */
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        Map<String, Object> result = authService.login(username, password);

        if (!(Boolean) result.get("success")) {
            return ResponseEntity.status(401).body(result);
        }

        return ResponseEntity.ok(result);
    }

    /**
     * Account verification - must exist in DB
     */
    @PostMapping("/account/verify")
    public ResponseEntity<?> verifyAccount(@RequestBody Map<String, String> request) {
        String accountNumber = request.get("accountNumber");

        // Check if account exists
        Optional<Account> accountOpt = accountRepository.findByAccountNumber(accountNumber);

        if (accountOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "message", "Account number not found in our system",
                    "accountNumber", accountNumber));
        }

        Account account = accountOpt.get();

        // Get customer details
        Optional<Customer> customerOpt = customerRepository.findByCifNumber(account.getCifNumber());

        if (customerOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "message", "Customer data not found"));
        }

        Customer customer = customerOpt.get();

        // Return customer data for auto-fill
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);

        Map<String, Object> accountData = new HashMap<>();
        accountData.put("accountNumber", account.getAccountNumber());
        accountData.put("bankName", account.getBankName());
        accountData.put("balance", account.getCurrentBalance());
        response.put("account", accountData);

        Map<String, Object> customerData = new HashMap<>();
        customerData.put("cifNumber", customer.getCifNumber());
        customerData.put("name", customer.getFullName());
        customerData.put("age", customer.getAge());
        customerData.put("phone", customer.getMobile());
        customerData.put("email", customer.getEmail());
        customerData.put("employmentType", customer.getEmploymentType());
        customerData.put("youngFirstBorrower", customer.getYoungFirstBorrowerFlag());
        response.put("customer", customerData);

        return ResponseEntity.ok(response);
    }

    /**
     * Send OTP to email from form + print to console
     */
    @PostMapping("/otp/send")
    public ResponseEntity<?> sendOTP(@RequestBody Map<String, String> request) {
        String accountNumber = request.get("accountNumber");
        String emailFromForm = request.get("email"); // Email from FORM!

        Map<String, Object> result = otpService.sendOTP(accountNumber, emailFromForm);

        return ResponseEntity.ok(result);
    }

    /**
     * Verify OTP
     */
    @PostMapping("/otp/verify")
    public ResponseEntity<?> verifyOTP(@RequestBody Map<String, String> request) {
        String accountNumber = request.get("accountNumber");
        String otp = request.get("otp");

        Map<String, Object> result = otpService.verifyOTP(accountNumber, otp);

        if (!(Boolean) result.get("success")) {
            return ResponseEntity.status(400).body(result);
        }

        return ResponseEntity.ok(result);
    }
}
