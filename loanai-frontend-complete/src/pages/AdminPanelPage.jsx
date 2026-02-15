import React, { useState, useEffect } from 'react';
import { adminAPI, loanAPI } from '../api';
import Navbar from '../components/Navbar';
import {
    Users, CheckCircle, XCircle, Clock, Search,
    Filter, ChevronRight, Eye, Check, X, AlertTriangle
} from 'lucide-react';

function AdminPanelPage() {
    const [stats, setStats] = useState({
        total: 0,
        approved: 0,
        rejected: 0,
        pending_review: 0,
        approval_rate: 0
    });
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedApp, setSelectedApp] = useState(null);
    const [decisionModal, setDecisionModal] = useState(false);
    const [decisionData, setDecisionData] = useState({
        decision: '',
        comments: '',
        reviewerName: 'Admin'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, appsRes] = await Promise.all([
                loanAPI.getStats(),
                adminAPI.getAllApplications()
            ]);
            setStats(statsRes.data);
            setApplications(appsRes.data);
        } catch (err) {
            console.error("Error fetching admin data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDecision = async () => {
        try {
            await adminAPI.makeDecision(
                selectedApp.applicationId,
                decisionData.decision,
                decisionData.reviewerName,
                decisionData.comments
            );
            setDecisionModal(false);
            setSelectedApp(null);
            fetchData(); // Refresh list
        } catch (err) {
            alert("Error saving decision: " + err.message);
        }
    };

    const filteredApps = applications.filter(app => {
        const matchesFilter = filter === 'ALL' || app.status === filter || app.decision === filter;
        const matchesSearch =
            app.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.applicationId?.toString().includes(searchTerm) ||
            app.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
            <Navbar />

            <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>Admin Control Center</h1>
                    <button
                        onClick={fetchData}
                        style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        Refresh Data
                    </button>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <StatCard icon={<Users color="#2563eb" />} label="Total Applications" value={stats.total} color="#dbeafe" />
                    <StatCard icon={<CheckCircle color="#059669" />} label="Approved" value={stats.approved} color="#d1fae5" />
                    <StatCard icon={<XCircle color="#dc2626" />} label="Rejected" value={stats.rejected} color="#fee2e2" />
                    <StatCard icon={<Clock color="#d97706" />} label="Pending Review" value={stats.pending_review} color="#fef3c7" />
                </div>

                {/* Filters & Search */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={20} style={{ position: 'absolute', left: '12px', top: '10px', color: '#9ca3af' }} />
                        <input
                            type="text"
                            placeholder="Search by name, ID, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ padding: '0.6rem 2rem 0.6rem 1rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                    >
                        <option value="ALL">All Status</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="MANUAL_REVIEW">Manual Review</option>
                    </select>
                </div>

                {/* Applications Table */}
                <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <tr>
                                <th style={thStyle}>ID</th>
                                <th style={thStyle}>Applicant</th>
                                <th style={thStyle}>Amount</th>
                                <th style={thStyle}>Risk Score</th>
                                <th style={thStyle}>Decision</th>
                                <th style={thStyle}>Applied On</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>Loading applications...</td>
                                </tr>
                            ) : filteredApps.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>No applications found matching your criteria.</td>
                                </tr>
                            ) : (
                                filteredApps.map(app => (
                                    <tr key={app.applicationId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={tdStyle}>#{app.applicationId}</td>
                                        <td style={tdStyle}>
                                            <div style={{ fontWeight: '500' }}>{app.applicantName}</div>
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>{app.email}</div>
                                        </td>
                                        <td style={tdStyle}>₹{app.loanAmount.toLocaleString()}</td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '40px', height: '6px', background: '#eee', borderRadius: '3px' }}>
                                                    <div style={{ width: `${(app.riskScore / 850) * 100}%`, height: '100%', background: getRiskColor(app.riskCategory), borderRadius: '3px' }} />
                                                </div>
                                                {app.riskScore}
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={getStatusStyle(app.decision || app.status)}>
                                                {app.decision || app.status}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>{new Date(app.appliedAt).toLocaleDateString()}</td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => setSelectedApp(app)}
                                                    style={iconBtnStyle} title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                {(app.decision === 'MANUAL_REVIEW' || app.status === 'PENDING') && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedApp(app);
                                                            setDecisionModal(true);
                                                        }}
                                                        style={{ ...iconBtnStyle, color: '#d97706' }} title="Make Decision"
                                                    >
                                                        <AlertTriangle size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Decision Modal */}
            {decisionModal && selectedApp && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Review Application #{selectedApp.applicationId}</h2>
                            <X size={20} style={{ cursor: 'pointer' }} onClick={() => setDecisionModal(false)} />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={labelStyle}>Applicant</label>
                            <div style={{ fontSize: '14px' }}>{selectedApp.applicantName}</div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={labelStyle}>Decision</label>
                                <select
                                    style={inputStyle}
                                    value={decisionData.decision}
                                    onChange={(e) => setDecisionData({ ...decisionData, decision: e.target.value })}
                                >
                                    <option value="">Select Action</option>
                                    <option value="APPROVED">APPROVE</option>
                                    <option value="REJECTED">REJECT</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Reviewer Name</label>
                                <input
                                    type="text"
                                    style={inputStyle}
                                    value={decisionData.reviewerName}
                                    onChange={(e) => setDecisionData({ ...decisionData, reviewerName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={labelStyle}>Comments</label>
                            <textarea
                                style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                                placeholder="Enter reason for decision..."
                                value={decisionData.comments}
                                onChange={(e) => setDecisionData({ ...decisionData, comments: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={handleDecision}
                                disabled={!decisionData.decision}
                                style={{ flex: 1, padding: '0.8rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Submit Decision
                            </button>
                            <button
                                onClick={() => setDecisionModal(false)}
                                style={{ flex: 1, padding: '0.8rem', background: '#eee', color: '#333', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ icon, label, value, color }) {
    return (
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', background: color, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                {icon}
            </div>
            <div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{label}</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{value}</p>
            </div>
        </div>
    );
}

// Styles
const thStyle = { padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151' };
const tdStyle = { padding: '1rem', fontSize: '14px', color: '#111827' };
const iconBtnStyle = { padding: '6px', border: '1px solid #e5e7eb', borderRadius: '4px', background: 'white', cursor: 'pointer', color: '#4b5563' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle = { background: 'white', padding: '2rem', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' };
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' };
const inputStyle = { width: '100%', padding: '0.8rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' };

const getRiskColor = (cat) => {
    switch (cat) {
        case 'LOW': return '#10b981';
        case 'MEDIUM': return '#f59e0b';
        case 'HIGH': return '#ef4444';
        default: return '#9ca3af';
    }
};

const getStatusStyle = (status) => {
    const base = { padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' };
    switch (status) {
        case 'APPROVED': return { ...base, background: '#d1fae5', color: '#065f46' };
        case 'REJECTED': return { ...base, background: '#fee2e2', color: '#991b1b' };
        case 'MANUAL_REVIEW': return { ...base, background: '#fef3c7', color: '#92400e' };
        default: return { ...base, background: '#f3f4f6', color: '#374151' };
    }
};

export default AdminPanelPage;
