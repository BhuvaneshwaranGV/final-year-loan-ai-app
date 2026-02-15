import React, { useEffect, useState } from 'react';
import { fraudAPI } from '../api';
import Navbar from '../components/Navbar';
import { AlertTriangle, Shield, Activity, DollarSign } from 'lucide-react';

function FraudDetectionPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fraudAPI.getStats();
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching fraud stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div style={{ padding: '20px' }}>Loading Fraud Detection System...</div>;

    return (
        <div style={{ background: '#f3f4f6', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>Fraud Detection System</h1>
                    <p style={{ color: '#6b7280' }}>Real-time monitoring and threat prevention</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                    <StatCard
                        title="Total Fraud Detected"
                        value={stats?.total_fraud_detected || 0}
                        icon={<AlertTriangle color="#ef4444" />}
                        bg="#fef2f2"
                        color="#b91c1c"
                    />
                    <StatCard
                        title="Prevented Value"
                        value={stats?.prevented_value || "₹ 0"}
                        icon={<DollarSign color="#10b981" />}
                        bg="#ecfdf5"
                        color="#047857"
                    />
                    <StatCard
                        title="Active Scanners"
                        value="9 Modules"
                        icon={<Activity color="#3b82f6" />}
                        bg="#eff6ff"
                        color="#1d4ed8"
                    />
                    <StatCard
                        title="System Status"
                        value="SECURE"
                        icon={<Shield color="#8b5cf6" />}
                        bg="#f5f3ff"
                        color="#6d28d9"
                    />
                </div>

                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>Detected Fraud Patterns</h2>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                    <th style={{ padding: '12px', fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>Fraud Pattern</th>
                                    <th style={{ padding: '12px', fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>Count</th>
                                    <th style={{ padding: '12px', fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>Severity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.patterns?.length > 0 ? stats.patterns.map((pattern, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '12px', fontWeight: '500' }}>{pattern.fraud_type}</td>
                                        <td style={{ padding: '12px' }}>{pattern.count}</td>
                                        <td style={{ padding: '12px' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '9999px',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                background: '#fef2f2',
                                                color: '#ef4444'
                                            }}>
                                                High
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>No fraud patterns detected yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, bg, color }) {
    return (
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </div>
            <div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{title}</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: color, margin: '4px 0 0 0' }}>{value}</p>
            </div>
        </div>
    );
}

export default FraudDetectionPage;
