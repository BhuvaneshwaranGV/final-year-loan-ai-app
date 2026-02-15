import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loanAPI } from '../api';
import Navbar from '../components/Navbar';
import { FileText, DollarSign, Briefcase, TrendingUp, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';

function LoanApplicationPage() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [accountDetails, setAccountDetails] = useState(null);

    const [formData, setFormData] = useState({
        cifNumber: '',
        age: '',
        name: '',
        email: '',
        monthlyIncome: '',
        employmentYears: '',
        existingDebt: '',
        foir: '',
        loanAmount: '',
        loanPurpose: 'Personal',
        hasProperty: false
    });

    useEffect(() => {
        const details = localStorage.getItem('loanApplicationDetails');
        if (details) {
            const parsed = JSON.parse(details);
            setAccountDetails(parsed);

            setFormData(prev => ({
                ...prev,
                cifNumber: parsed.customer?.cifNumber || '',
                age: parsed.customer?.age || '',
                name: parsed.customer?.name || '',
                email: parsed.customer?.email || ''
            }));
        } else {
            navigate('/verify');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: finalValue
        }));

        // Auto-calculate FOIR
        if (name === 'monthlyIncome' || name === 'existingDebt') {
            const income = name === 'monthlyIncome' ? parseFloat(value) : parseFloat(formData.monthlyIncome);
            const debt = name === 'existingDebt' ? parseFloat(value) : parseFloat(formData.existingDebt);
            if (income && debt) {
                const foir = ((debt / income) * 100).toFixed(2);
                setFormData(prev => ({ ...prev, foir }));
            }
        }
    };

    const handleNext = () => {
        setError('');
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        setError('');
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            const applicationData = {
                ...formData,
                age: parseInt(formData.age),
                monthlyIncome: parseFloat(formData.monthlyIncome),
                employmentYears: parseInt(formData.employmentYears),
                loanAmount: parseFloat(formData.loanAmount),
                existingDebt: parseFloat(formData.existingDebt),
                foir: parseFloat(formData.foir),
                hasProperty: formData.hasProperty
            };

            const response = await loanAPI.submitApplication(applicationData);

            if (response.data.success) {
                localStorage.setItem('lastApplicationId', response.data.application.applicationId);
                localStorage.setItem('applicationData', JSON.stringify(response.data.application));
                navigate('/processing');
            } else {
                setError(response.data.message || 'Application submission failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error submitting application');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Navbar />
            <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '2.5rem',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                }}>
                    {/* Progress Indicator */}
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            {[1, 2, 3].map((step) => (
                                <div key={step} style={{ flex: 1, textAlign: 'center' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: currentStep >= step ? '#667eea' : '#e5e7eb',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto',
                                        fontWeight: 'bold',
                                        transition: 'all 0.3s'
                                    }}>
                                        {currentStep > step ? <CheckCircle size={24} /> : step}
                                    </div>
                                    <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: currentStep >= step ? '#667eea' : '#6b7280' }}>
                                        {step === 1 ? 'Personal' : step === 2 ? 'Financial' : 'Review'}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div style={{ height: '4px', background: '#e5e7eb', borderRadius: '2px', position: 'relative', marginTop: '-20px', zIndex: -1 }}>
                            <div style={{
                                height: '100%',
                                background: '#667eea',
                                borderRadius: '2px',
                                width: `${((currentStep - 1) / 2) * 100}%`,
                                transition: 'width 0.3s'
                            }} />
                        </div>
                    </div>

                    <h2 style={{ color: '#1f2937', marginBottom: '1.5rem', textAlign: 'center' }}>
                        {currentStep === 1 ? 'Personal Information' : currentStep === 2 ? 'Financial Details' : 'Review & Submit'}
                    </h2>

                    {error && (
                        <div style={{
                            background: '#fee2e2',
                            border: '1px solid #ef4444',
                            color: '#991b1b',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '1rem'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Step 1: Personal Info */}
                    {currentStep === 1 && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <FormField
                                icon={<FileText size={20} />}
                                label="CIF Number"
                                name="cifNumber"
                                value={formData.cifNumber}
                                onChange={handleChange}
                                readOnly
                            />
                            <FormField
                                icon={<FileText size={20} />}
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                readOnly
                            />
                            <FormField
                                icon={<FileText size={20} />}
                                label="Age"
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleChange}
                                readOnly
                            />
                            <FormField
                                icon={<FileText size={20} />}
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>
                    )}

                    {/* Step 2: Financial Details */}
                    {currentStep === 2 && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <FormField
                                icon={<DollarSign size={20} />}
                                label="Monthly Income (₹)"
                                name="monthlyIncome"
                                type="number"
                                value={formData.monthlyIncome}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                            />
                            <FormField
                                icon={<Briefcase size={20} />}
                                label="Employment Years"
                                name="employmentYears"
                                type="number"
                                value={formData.employmentYears}
                                onChange={handleChange}
                                required
                                min="0"
                                max="50"
                            />
                            <FormField
                                icon={<DollarSign size={20} />}
                                label="Existing Debt (₹)"
                                name="existingDebt"
                                type="number"
                                value={formData.existingDebt}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                            />
                            <FormField
                                icon={<TrendingUp size={20} />}
                                label="FOIR (%)"
                                name="foir"
                                type="number"
                                value={formData.foir}
                                onChange={handleChange}
                                readOnly
                                step="0.01"
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px', gridColumn: 'span 2' }}>
                                <input
                                    type="checkbox"
                                    name="hasProperty"
                                    checked={formData.hasProperty}
                                    onChange={handleChange}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                                <label style={{ color: '#374151', fontWeight: '500', cursor: 'pointer' }}>
                                    I own a property (Asset)
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Loan Details & Review */}
                    {currentStep === 3 && (
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                                <FormField
                                    icon={<DollarSign size={20} />}
                                    label="Loan Amount (₹)"
                                    name="loanAmount"
                                    type="number"
                                    value={formData.loanAmount}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                />
                                <div>
                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        color: '#374151',
                                        fontWeight: '500',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <FileText size={20} />
                                        Loan Purpose
                                    </label>
                                    <select
                                        name="loanPurpose"
                                        value={formData.loanPurpose}
                                        onChange={handleChange}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        <option value="Personal">Personal</option>
                                        <option value="Home">Home</option>
                                        <option value="Auto">Auto</option>
                                        <option value="Education">Education</option>
                                        <option value="Business">Business</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{
                                background: '#f9fafb',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                padding: '1.5rem'
                            }}>
                                <h3 style={{ color: '#1f2937', marginBottom: '1rem' }}>Application Summary</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.9rem' }}>
                                    <SummaryItem label="Name" value={formData.name} />
                                    <SummaryItem label="CIF" value={formData.cifNumber} />
                                    <SummaryItem label="Monthly Income" value={`₹${parseFloat(formData.monthlyIncome || 0).toLocaleString()}`} />
                                    <SummaryItem label="Employment Years" value={formData.employmentYears} />
                                    <SummaryItem label="Existing Debt" value={`₹${parseFloat(formData.existingDebt || 0).toLocaleString()}`} />
                                    <SummaryItem label="FOIR" value={`${formData.foir}%`} />
                                    <SummaryItem label="Loan Amount" value={`₹${parseFloat(formData.loanAmount || 0).toLocaleString()}`} />
                                    <SummaryItem label="Purpose" value={formData.loanPurpose} />
                                    <SummaryItem label="Has Property" value={formData.hasProperty ? "Yes" : "No"} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        {currentStep > 1 && (
                            <button
                                onClick={handlePrevious}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: 'white',
                                    color: '#667eea',
                                    border: '2px solid #667eea',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <ChevronLeft size={20} />
                                Previous
                            </button>
                        )}
                        {currentStep < 3 ? (
                            <button
                                onClick={handleNext}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                Next
                                <ChevronRight size={20} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: loading ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {loading ? 'Submitting...' : 'Submit Application'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function FormField({ icon, label, name, type = 'text', value, onChange, required, readOnly, min, max, step }) {
    return (
        <div>
            <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#374151',
                fontWeight: '500',
                marginBottom: '0.5rem'
            }}>
                {icon}
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                readOnly={readOnly}
                min={min}
                max={max}
                step={step}
                style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'all 0.3s',
                    background: readOnly ? '#f3f4f6' : 'white'
                }}
                onFocus={(e) => !readOnly && (e.target.style.borderColor = '#667eea')}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
        </div>
    );
}

function SummaryItem({ label, value }) {
    return (
        <div>
            <p style={{ color: '#6b7280', margin: '0 0 0.25rem 0', fontSize: '0.85rem' }}>{label}</p>
            <p style={{ color: '#1f2937', margin: 0, fontWeight: '500' }}>{value}</p>
        </div>
    );
}

export default LoanApplicationPage;
