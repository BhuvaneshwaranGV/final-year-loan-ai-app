import React, { useState, useEffect } from 'react';
import { loanAPI } from '../api';
import Navbar from '../components/Navbar';
import {
    Wallet, TrendingUp, Clock, AlertCircle,
    ArrowRight, ChevronRight, PieChart, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [accountInfo, setAccountInfo] = useState({
        balance: 0,
        accountNumber: '',
        bankName: ''
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        const applicationDetails = localStorage.getItem('loanApplicationDetails');

        if (!userData) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        if (applicationDetails) {
            const details = JSON.parse(applicationDetails);
            setAccountInfo({
                balance: details.account?.balance || 0,
                accountNumber: details.account?.accountNumber || '',
                bankName: details.account?.bankName || 'LoanAI Bank'
            });
        }

        fetchHistory(parsedUser.email || extractedEmail(applicationDetails));
    }, [navigate]);

    const extractedEmail = (detailsStr) => {
        if (!detailsStr) return null;
        try {
            return JSON.parse(detailsStr).customer?.email;
        } catch { return null; }
    }

    const fetchHistory = async (email) => {
        if (!email) {
            setLoading(false);
            return;
        }
        try {
            const res = await loanAPI.track({ email });
            setApplications(res.data);
        } catch (err) {
            console.error("Error fetching history:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <Navbar />

            <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b' }}>Account Dashboard</h1>
                    <p style={{ color: '#64748b' }}>Welcome back, {user?.username}. Here's your financial summary.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    {/* Left Column: Account & History */}
                    <div>
                        {/* Account Card */}
                        <div style={{
                            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                            padding: '2rem',
                            borderRadius: '20px',
                            color: 'white',
                            marginBottom: '2rem',
                            boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div>
                                    <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '0.5rem' }}>Current Balance</p>
                                    <h2 style={{ fontSize: '32px', fontWeight: 'bold' }}>₹{accountInfo.balance.toLocaleString()}</h2>
                                </div>
                                <Wallet size={32} style={{ opacity: 0.8 }} />
                            </div>
                            <div style={{ display: 'flex', gap: '2rem', fontSize: '14px' }}>
                                <div>
                                    <p style={{ opacity: 0.8, marginBottom: '0.25rem' }}>Account Number</p>
                                    <p style={{ fontWeight: '500' }}>{accountInfo.accountNumber || '**** **** ****'}</p>
                                </div>
                                <div>
                                    <p style={{ opacity: 0.8, marginBottom: '0.25rem' }}>Bank</p>
                                    <p style={{ fontWeight: '500' }}>{accountInfo.bankName}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Applications */}
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>Recent Loan Applications</h3>
                                <button
                                    onClick={() => navigate('/track')}
                                    style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                    Track All <ChevronRight size={16} />
                                </button>
                            </div>

                            {loading ? (
                                <p style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Fetching history...</p>
                            ) : applications.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '12px' }}>
                                    <AlertCircle size={40} color="#94a3b8" style={{ marginBottom: '1rem' }} />
                                    <p style={{ color: '#64748b', marginBottom: '1rem' }}>You haven't applied for any loans yet.</p>
                                    <button
                                        onClick={() => navigate('/account-verify')}
                                        style={{ padding: '0.6rem 1.2rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {applications.slice(0, 5).map(app => (
                                        <div
                                            key={app.applicationId}
                                            onClick={() => navigate(`/result/${app.applicationId}`)}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '1rem',
                                                border: '1px solid #f1f5f9',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    background: '#f1f5f9',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#2563eb'
                                                }}>
                                                    <Clock size={20} />
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: '600', color: '#1e293b', margin: 0 }}>₹{app.loanAmount.toLocaleString()}</p>
                                                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{app.loanPurpose} • {new Date(app.appliedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={getStatusStyle(app.decision || app.status)}>
                                                    {app.decision || app.status}
                                                </span>
                                                <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>ID: #{app.applicationId}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Insights */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Quick Stats */}
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' }}>Financial Insights</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <TrendingUp color="#10b981" size={20} />
                                    <div>
                                        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>History Count</p>
                                        <p style={{ fontWeight: 'bold', margin: 0 }}>{applications.length} Applications</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <Activity color="#8b5cf6" size={20} />
                                    <div>
                                        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Active Loans</p>
                                        <p style={{ fontWeight: 'bold', margin: 0 }}>0 Active</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tips Card */}
                        <div style={{ background: '#fef2f2', padding: '1.5rem', borderRadius: '16px', border: '1px solid #fee2e2' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#991b1b' }}>
                                <AlertCircle size={20} />
                                <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>Approval Tip</h3>
                            </div>
                            <p style={{ fontSize: '13px', color: '#991b1b', lineHeight: '1.5', margin: 0 }}>
                                Keeping your FOIR (Fixed Obligation to Income Ratio) below 40% significantly increases your chances of instant AI approval.
                            </p>
                            <button
                                onClick={() => navigate('/account-verify')}
                                style={{ marginTop: '1rem', width: '100%', padding: '0.5rem', background: 'white', color: '#991b1b', border: '1px solid #fee2e2', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                            >
                                Re-Apply with Better FOIR <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const getStatusStyle = (status) => {
    const base = { padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 'bold' };
    switch (status) {
        case 'APPROVED': return { ...base, background: '#dcfce7', color: '#166534' };
        case 'REJECTED': return { ...base, background: '#fee2e2', color: '#991b1b' };
        case 'MANUAL_REVIEW': return { ...base, background: '#fef3c7', color: '#92400e' };
        default: return { ...base, background: '#f1f5f9', color: '#475569' };
    }
};

export default DashboardPage;
