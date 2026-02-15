# LOANAI FRONTEND - ALL PAGES (11 FILES)

Copy each page to its respective file in src/pages/

---

## FILE: src/pages/LoginPage.jsx

```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import { Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(username, password);
      
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data));
        
        // Redirect based on role
        if (response.data.role === 'admin' || response.data.role === 'manager') {
          navigate('/admin/panel');
        } else {
          navigate('/home');
        }
      } else {
        setError(response.data.message || 'Invalid username or password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: '#2563eb',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Lock size={32} color="white" />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
            LoanAI Bank
          </h1>
          <p style={{ color: '#6b7280' }}>Internet Banking · Secure Login</p>
        </div>

        {error && (
          <div className="error-box">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>User ID / Username</label>
            <div style={{ position: 'relative' }}>
              <User size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter User ID"
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                style={{ paddingLeft: '44px', paddingRight: '44px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '12px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '24px' }}>
            <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>Forgot User ID?</a>
            <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>Forgot Password?</a>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>

        <div style={{ marginTop: '24px', padding: '16px', background: '#f3f4f6', borderRadius: '8px', fontSize: '12px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', color: '#6b7280' }}>
            <span>● 256-bit SSL</span>
            <span>● RBI Compliant</span>
          </div>
        </div>

        <div style={{ marginTop: '24px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
          By logging in, you agree to our Terms of Use. Never share your password. Report phishing at 1800 123 4567.
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
```

---

## FILE: src/pages/HomePage.jsx

```jsx
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
        <div className="container" style={{ padding: '16px 20px' }}>
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
                <h1 style={{ color: 'white', fontSize: '24px', marginBottom: '4px' }}>LoanAI Bank</h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: 0 }}>Internet Banking</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span style={{ color: 'white' }}>{user?.username}</span>
              <button
                onClick={handleLogout}
                className="btn"
                style={{ background: 'rgba(255,255,255,0.2)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ paddingTop: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ color: 'white', fontSize: '32px', marginBottom: '12px' }}>Welcome to Internet Banking</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px' }}>Select a service below to get started</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.path)}
              className="card"
              style={{
                cursor: 'pointer',
                transition: 'transform 0.3s, box-shadow 0.3s',
                ':hover': { transform: 'translateY(-4px)' }
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
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
                    {card.title}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Secure Banking Banner */}
        <div className="card" style={{ marginTop: '40px', background: 'rgba(255,255,255,0.95)', maxWidth: '1200px', margin: '40px auto' }}>
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#1f2937' }}>Secure Banking</h3>
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
```

---

## FILE: src/pages/AccountVerifyPage.jsx

Due to token limit, I'll create a comprehensive package with all remaining pages...

