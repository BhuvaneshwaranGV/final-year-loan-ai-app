import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, BarChart3, Shield, Settings, LogOut } from 'lucide-react';

function HomePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/login');
        } else {
            setUser(JSON.parse(userData));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const cards = [
        {
            title: 'Apply for Loan',
            description: 'Home, Personal, Education & Vehicle loans',
            icon: FileText,
            color: '#2563eb',
            path: '/account-verify'
        },
        {
            title: 'Track Application',
            description: 'Check loan status by ID or email',
            icon: Search,
            color: '#10b981',
            path: '/track'
        },
        {
            title: 'Account Summary',
            description: 'Dashboard & analytics',
            icon: BarChart3,
            color: '#f59e0b',
            path: '/dashboard'
        },
        {
            title: 'Fraud Detection',
            description: '9 pattern fraud detection system',
            icon: Shield,
            color: '#ef4444',
            path: '/fraud-detection'
        },
        {
            title: 'Admin Portal',
            description: 'Feedback & model management',
            icon: Settings,
            color: '#8b5cf6',
            path: '/admin'
        }
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
            {/* Header */}
            <div style={{ background: 'rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                <div className="container" style={{ padding: '16px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Shield color="#2563eb" />
                            </div>
                            <div>
                                <h1 style={{ color: 'white', fontSize: '24px', marginBottom: '4px', margin: 0 }}>LoanAI Bank</h1>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: 0 }}>Internet Banking</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <span style={{ color: 'white' }}>{user?.username}</span>
                            <button
                                onClick={handleLogout}
                                className="btn"
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container" style={{ paddingTop: '40px', paddingLeft: '20px', paddingRight: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ color: 'white', fontSize: '32px', marginBottom: '12px' }}>Welcome to Internet Banking</h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px' }}>Select a service below to get started</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px'
                }}>
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(card.path)}
                            className="card"
                            style={{
                                cursor: 'pointer',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                background: 'white',
                                padding: '24px',
                                borderRadius: '16px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    background: card.color,
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <card.icon size={28} color="white" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#1f2937', marginTop: 0 }}>
                                        {card.title}
                                    </h3>
                                    <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                                        {card.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Secure Banking Banner */}
                <div className="card" style={{ marginTop: '40px', background: 'rgba(255,255,255,0.95)', maxWidth: '1200px', margin: '40px auto', borderRadius: '16px' }}>
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                        <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#1f2937', marginTop: 0 }}>Secure Banking</h3>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', color: '#6b7280', fontSize: '14px' }}>
                            <span>● 256-bit SSL encryption</span>
                            <span>● RBI compliant</span>
                            <span>● Phishing protected</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: '40px 0 20px', color: 'rgba(255,255,255,0.6)', fontSize: '12px', textAlign: 'center' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <strong style={{ color: 'white' }}>Quick Links</strong>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '8px' }}>
                            <a href="#" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Branch Locator</a>
                            <a href="#" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Contact Us</a>
                            <a href="#" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>FAQs</a>
                            <a href="#" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>NEFT / RTGS</a>
                        </div>
                    </div>
                    <div>
                        <strong style={{ color: 'white' }}>Toll Free:</strong> 1800 123 4567
                    </div>
                    <div style={{ marginTop: '16px' }}>
                        LoanAI Bank © 2026 · Internet Banking · ML Loan Approver · B.E. CSE Project
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
