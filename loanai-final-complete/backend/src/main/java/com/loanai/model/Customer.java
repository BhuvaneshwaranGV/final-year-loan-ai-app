package com.loanai.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "customer_master")
@Data
public class Customer {

    @Id
    @Column(name = "customer_id")
    private String customerId;

    @Column(name = "cif_number", unique = true)
    private String cifNumber;

    public String getCifNumber() {
        return cifNumber;
    }

    public void setCifNumber(String cifNumber) {
        this.cifNumber = cifNumber;
    }

    @Column(name = "full_name")
    private String fullName;

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    private LocalDate dob;
    private Integer age;
    private String gender;

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    @Column(name = "pan_number")
    private String panNumber;

    @Column(name = "aadhaar_masked")
    private String aadhaarMasked;

    private String mobile;
    private String email;

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    private String city;
    private String state;

    @Column(name = "employment_type")
    private String employmentType;

    public String getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(String employmentType) {
        this.employmentType = employmentType;
    }

    @Column(name = "employer_name")
    private String employerName;

    @Column(name = "monthly_income_declared")
    private BigDecimal monthlyIncomeDeclared;

    @Column(name = "risk_profile")
    private String riskProfile;

    @Column(name = "kyc_status")
    private String kycStatus;

    @Column(name = "young_first_borrower_flag")
    private Boolean youngFirstBorrowerFlag;

    public Boolean getYoungFirstBorrowerFlag() {
        return youngFirstBorrowerFlag;
    }

    public void setYoungFirstBorrowerFlag(Boolean youngFirstBorrowerFlag) {
        this.youngFirstBorrowerFlag = youngFirstBorrowerFlag;
    }
}
