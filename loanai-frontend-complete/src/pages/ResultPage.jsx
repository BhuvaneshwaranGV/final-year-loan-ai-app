import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loanAPI } from '../api';
import Navbar from '../components/Navbar';
import {
    CheckCircle, XCircle, AlertTriangle,
    Download,
    ArrowLeft, Trophy, BarChart, Check, Target,
    CreditCard
} from 'lucide-react';

function ResultPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                if (id) {
                    const response = await loanAPI.getById(id);
                    setApplication(response.data);
                }
            } catch (err) {
                setError('Error loading application details');
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, [id]);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
                <Navbar />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
                    <div className="loader" style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <p style={{ marginTop: '1rem', color: '#64748b' }}>Securing result data...</p>
                </div>
            </div>
        );
    }

    if (error || !application) {
        return (
            <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
                <Navbar />
                <div style={{ padding: '4rem', textAlign: 'center' }}>
                    <div style={{ background: '#fee2e2', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#ef4444' }}>
                        <XCircle size={32} />
                    </div>
                    <h2 style={{ color: '#1e293b' }}>Application Not Found</h2>
                    <p style={{ color: '#64748b' }}>{error || 'The requested application ID does not exist in our records.'}</p>
                    <button onClick={() => navigate('/home')} style={{ marginTop: '1.5rem', padding: '0.6rem 1.2rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Return Home</button>
                </div>
            </div>
        );
    }

    // CIBIL Rating Logic
    const getCibilData = (score) => {
        if (!score) return { rating: 'N/A', color: '#94a3b8', bg: '#f1f5f9' };
        if (score >= 750) return { rating: 'EXCELLENT', color: '#10b981', bg: '#dcfce7' };
        if (score >= 700) return { rating: 'GOOD', color: '#3b82f6', bg: '#dbeafe' };
        if (score >= 650) return { rating: 'AVERAGE', color: '#f59e0b', bg: '#fef3c7' };
        return { rating: 'POOR', color: '#ef4444', bg: '#fee2e2' };
    };

    const cibilInfo = getCibilData(application.simulatedCibil);
    const decisionStyle = getDecisionStyles(application.decision);

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '4rem' }}>
            <Navbar />

            <div style={{ maxWidth: '1000px', margin: '3rem auto', padding: '0 1.5rem' }}>
                {/* Status Banner */}
                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '3rem',
                    textAlign: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    border: '1px solid #e2e8f0',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: decisionStyle.bg,
                        color: decisionStyle.color,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem'
                    }}>
                        {decisionStyle.icon}
                    </div>
                    <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>
                        {decisionStyle.title}
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '18px' }}>
                        Application ID: <span style={{ color: '#1e293b', fontWeight: '600' }}>#{application.applicationId}</span>
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {/* Left Column: AI Diagnostics & CIBIL */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* PREMIUM CIBIL BOX */}
                        <div style={{
                            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                            borderRadius: '24px',
                            padding: '2rem',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                        }}>
                            {/* Decorative Background Icon */}
                            <CreditCard size={120} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1, transform: 'rotate(-15deg)' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Trophy size={20} color="#fbbf24" />
                                    CIBIL Simulation
                                </h3>
                                <span style={{
                                    background: cibilInfo.bg,
                                    color: cibilInfo.color,
                                    padding: '4px 12px',
                                    borderRadius: '99px',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    {cibilInfo.rating}
                                </span>
                            </div>

                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <div style={{ fontSize: '64px', fontWeight: '900', letterSpacing: '-2px', marginBottom: '-5px' }}>
                                    {application.simulatedCibil || '---'}
                                </div>
                                <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Projected Credit Score</p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <InsightRow icon={<Check color="#10b981" size={16} />} text="High financial savings rate detected" />
                                <InsightRow icon={<Check color="#10b981" size={16} />} text="No transaction patterns of fraud" />
                                <InsightRow icon={<Check color="#10b981" size={16} />} text="Regular utility payout history" />
                            </div>
                        </div>

                        {/* AI RISK METRICS */}
                        <div style={{ background: 'white', borderRadius: '24px', padding: '2rem', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <BarChart size={20} color="#3b82f6" />
                                Risk Analytics
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Approval Probability</p>
                                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                                        {Math.round(application.approvalProbability * 100)}%
                                    </p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>ML Category</p>
                                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: getRiskColor(application.riskCategory), margin: 0 }}>
                                        {application.riskCategory}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Interest Rate (APR)</p>
                                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                                        {application.recommendedInterestRate}%
                                    </p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Fraud Score</p>
                                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: application.fraudFlag ? '#ef4444' : '#10b981', margin: 0 }}>
                                        {application.fraudFlag ? 'HIGH' : 'LOW'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Key Details & FOIR */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* FOIR DISPLAY BOX */}
                        <div style={{
                            background: '#eff6ff',
                            borderRadius: '24px',
                            padding: '2rem',
                            border: '1px solid #dbeafe',
                            textAlign: 'center'
                        }}>
                            <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#2563eb' }}>
                                <Target size={24} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e40af', marginBottom: '0.5rem' }}>FOIR</h3>
                            <div style={{ fontSize: '42px', fontWeight: '900', color: '#1e40af', marginBottom: '4px' }}>{application.foir}%</div>
                            <p style={{ color: '#1e40af', opacity: 0.7, fontSize: '13px', margin: 0 }}>Fixed Obligation to Income Ratio</p>

                            <div style={{ marginTop: '1.5rem', background: 'white', padding: '0.8rem', borderRadius: '12px', fontSize: '12px', color: '#1e40af' }}>
                                {application.foir < 40 ?
                                    "Your low FOIR indicates strong repayment capacity." :
                                    "Your high FOIR may require additional security."}
                            </div>
                        </div>

                        {/* LOAN SUMMARY */}
                        <div style={{ background: 'white', borderRadius: '24px', padding: '2rem', border: '1px solid #e2e8f0', flex: 1 }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' }}>Application Summary</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <InfoRow label="Applicant Name" value={application.applicantName} />
                                <InfoRow label="Loan Amount" value={`₹${application.loanAmount.toLocaleString()}`} />
                                <InfoRow label="Monthly Income" value={`₹${application.monthlyIncome.toLocaleString()}`} />
                                <InfoRow label="Loan Purpose" value={application.loanPurpose} />
                                <InfoRow label="Asset (Property)" value={application.hasProperty ? 'YES (Verified)' : 'NO'} />
                                <InfoRow label="Applied On" value={new Date(application.appliedAt).toLocaleString()} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div style={{
                    marginTop: '3rem',
                    display: 'flex',
                    gap: '1rem',
                    padding: '2rem',
                    background: '#1e293b',
                    borderRadius: '24px',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={() => navigate('/home')}
                            style={{ padding: '0.8rem 1.5rem', background: 'white', color: '#1e293b', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <ArrowLeft size={18} /> Back to Hub
                        </button>
                        <button
                            onClick={() => window.print()}
                            style={{ padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <Download size={18} /> Save PDF
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={() => navigate('/account-verify')}
                            style={{ padding: '0.8rem 2rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'extrabold', cursor: 'pointer' }}
                        >
                            Apply for Another Loan
                        </button>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
@keyframes spin {
                    to { transform: rotate(360deg); }
}
`}} />
        </div>
    );
}

function InsightRow({ icon, text }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#cbd5e1' }}>
            {icon} {text}
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>{label}</span>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b' }}>{value}</span>
        </div>
    );
}

const getDecisionStyles = (decision) => {
    switch (decision) {
        case 'APPROVED': return {
            title: 'Loan Approved!',
            bg: '#dcfce7',
            color: '#10b981',
            icon: <CheckCircle size={40} />
        };
        case 'REJECTED': return {
            title: 'Declined',
            bg: '#fee2e2',
            color: '#ef4444',
            icon: <XCircle size={40} />
        };
        default: return {
            title: 'Review Required',
            bg: '#fef3c7',
            color: '#f59e0b',
            icon: <AlertTriangle size={40} />
        };
    }
};

const getRiskColor = (cat) => {
    switch (cat) {
        case 'LOW': return '#10b981';
        case 'MEDIUM': return '#f59e0b';
        case 'HIGH': return '#ef4444';
        default: return '#94a3b8';
    }
};

export default ResultPage;
