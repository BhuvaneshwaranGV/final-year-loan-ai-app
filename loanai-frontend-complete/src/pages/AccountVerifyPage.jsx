import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import { Shield, Mail, Clock, CheckCircle, AlertCircle } from 'lucide-react';

function AccountVerifyPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState('account'); // 'account', 'otp'
    const [accountNumber, setAccountNumber] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [accountDetails, setAccountDetails] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [otpSent, setOtpSent] = useState(false);

    // Countdown timer
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleCheckAccount = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.verifyAccount(accountNumber);
            if (response.data.success) {
                setAccountDetails(response.data);
                setEmail(response.data.customer?.email || '');
                setSuccess('Account verified successfully!');
            } else {
                setError(response.data.message || 'Account not found');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error verifying account');
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = async () => {
        if (!email) {
            setError('Please enter your email');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await authAPI.sendOTP(accountNumber, email);
            if (response.data.success) {
                setOtpSent(true);
                setStep('otp');
                setCountdown(120); // 2 minutes
                setSuccess(`OTP sent to ${email} and printed in backend console!`);
            } else {
                setError(response.data.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error sending OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.verifyOTP(accountNumber, otp);
            if (response.data.success) {
                // Store account details for application
                localStorage.setItem('loanApplicationDetails', JSON.stringify(accountDetails));
                setSuccess('OTP verified! Redirecting...');
                setTimeout(() => navigate('/apply'), 1000);
            } else {
                setError(response.data.message || 'Invalid OTP');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error verifying OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = () => {
        setOtp('');
        handleSendOTP();
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2.5rem',
                maxWidth: '500px',
                width: '100%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Shield size={56} style={{ color: '#667eea', margin: '0 auto' }} />
                    <h1 style={{ color: '#1f2937', marginTop: '1rem', fontSize: '1.8rem' }}>
                        Account Verification
                    </h1>
                    <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                        {step === 'account' ? 'Verify your account to apply for a loan' : 'Enter the OTP sent to your email'}
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: '#fee2e2',
                        border: '1px solid #ef4444',
                        color: '#991b1b',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                {success && (
                    <div style={{
                        background: '#d1fae5',
                        border: '1px solid #10b981',
                        color: '#065f46',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <CheckCircle size={20} />
                        {success}
                    </div>
                )}

                {step === 'account' && (
                    <form onSubmit={handleCheckAccount}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.5rem' }}>
                                Account Number
                            </label>
                            <input
                                type="text"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '1rem'
                                }}
                                placeholder="Enter your account number"
                                required
                                disabled={accountDetails !== null}
                            />
                        </div>

                        {!accountDetails && (
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: loading ? '#9ca3af' : '#667eea',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {loading ? 'Checking...' : 'Check Account'}
                            </button>
                        )}

                        {accountDetails && (
                            <div style={{
                                background: '#f0fdf4',
                                border: '2px solid #86efac',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                marginBottom: '1.5rem'
                            }}>
                                <h3 style={{ color: '#166534', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CheckCircle size={24} />
                                    Account Found
                                </h3>
                                <div style={{ color: '#166534', fontSize: '0.95rem' }}>
                                    <p style={{ margin: '0.5rem 0' }}><strong>Name:</strong> {accountDetails.customer?.name}</p>
                                    <p style={{ margin: '0.5rem 0' }}><strong>Bank:</strong> {accountDetails.account?.bankName}</p>
                                    <p style={{ margin: '0.5rem 0' }}><strong>Balance:</strong> ₹{accountDetails.account?.balance?.toLocaleString()}</p>
                                    <p style={{ margin: '0.5rem 0' }}><strong>CIF:</strong> {accountDetails.customer?.cifNumber}</p>
                                </div>
                            </div>
                        )}

                        {accountDetails && !otpSent && (
                            <>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Mail size={18} />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '1rem'
                                        }}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={handleSendOTP}
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: loading ? '#9ca3af' : '#10b981',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        cursor: loading ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {loading ? 'Sending...' : 'Send OTP'}
                                </button>
                            </>
                        )}
                    </form>
                )}

                {step === 'otp' && (
                    <form onSubmit={handleVerifyOTP}>
                        <div style={{
                            background: '#eff6ff',
                            border: '1px solid #3b82f6',
                            borderRadius: '8px',
                            padding: '1rem',
                            marginBottom: '1.5rem',
                            textAlign: 'center'
                        }}>
                            <Clock size={24} style={{ color: '#3b82f6', margin: '0 auto 0.5rem' }} />
                            <p style={{ color: '#1e40af', margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
                                {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                            </p>
                            <p style={{ color: '#3b82f6', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
                                Time remaining
                            </p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.5rem' }}>
                                Enter 6-Digit OTP
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '1.5rem',
                                    textAlign: 'center',
                                    letterSpacing: '0.5rem'
                                }}
                                placeholder="000000"
                                maxLength={6}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: (loading || otp.length !== 6) ? '#9ca3af' : '#667eea',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer',
                                marginBottom: '1rem'
                            }}
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>

                        {countdown === 0 ? (
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'transparent',
                                    color: '#667eea',
                                    border: '2px solid #667eea',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                Resend OTP
                            </button>
                        ) : (
                            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
                                Didn't receive OTP? Wait {countdown}s to resend
                            </p>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
}

export default AccountVerifyPage;
