import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home, FileText, Shield, BarChart3, User } from 'lucide-react';

function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <h1 style={{ color: 'white', margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
                    LoanAI
                </h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <NavButton icon={<Home size={18} />} label="Home" onClick={() => navigate('/home')} />
                    <NavButton icon={<FileText size={18} />} label="Track" onClick={() => navigate('/track')} />
                    {user.role === 'ADMIN' && (
                        <>
                            <NavButton icon={<Shield size={18} />} label="Fraud" onClick={() => navigate('/fraud')} />
                            <NavButton icon={<BarChart3 size={18} />} label="Dashboard" onClick={() => navigate('/dashboard')} />
                            <NavButton icon={<User size={18} />} label="Admin" onClick={() => navigate('/admin')} />
                        </>
                    )}
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: 'white', fontSize: '0.9rem' }}>
                    {user.username || 'User'}
                </span>
                <button
                    onClick={handleLogout}
                    style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                    onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </nav>
    );
}

function NavButton({ icon, label, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s',
                fontSize: '0.9rem'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
        >
            {icon}
            {label}
        </button>
    );
}

export default Navbar;
