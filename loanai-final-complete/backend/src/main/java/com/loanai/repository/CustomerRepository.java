package com.loanai.repository;

import com.loanai.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {
    Optional<Customer> findByCifNumber(String cifNumber);

    Optional<Customer> findByEmail(String email);
}
