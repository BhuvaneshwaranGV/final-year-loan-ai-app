import React, { useState } from 'react';
import { loanAPI } from '../api';
import Navbar from '../components/Navbar';
import { Search, FileSearch, ArrowRight, Calendar, AlertCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function TrackPage() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setSearched(true);
        try {
            const params = {};
            if (query.includes('@')) {
                params.email = query.trim();
            } else {
                params.id = query.trim();
            }

            const res = await loanAPI.track(params);
            setResults(res.data);
        } catch (err) {
            console.error("Search error:", err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <Navbar />

            <div style={{ padding: '3rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: '#2563eb',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)'
                    }}>
                        <FileSearch size={32} />
                    </div>
                    <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Track Application</h1>
                    <p style={{ color: '#64748b', fontSize: '18px' }}>Enter your Application ID or Email to check your status</p>
                </div>

                {/* Search Box */}
                <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: '3rem' }}>
                    <input
                        type="text"
                        placeholder="Ex: 123456 or name@example.com"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1.25rem 4rem 1.25rem 1.5rem',
                            fontSize: '18px',
                            border: '2px solid #e2e8f0',
                            borderRadius: '16px',
                            outline: 'none',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                            boxSizing: 'border-box'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '10px',
                            bottom: '10px',
                            width: '50px',
                            background: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {loading ? <div className="spinner-small" /> : <Search size={20} />}
                    </button>
                </form>

                {/* Results Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {searched && results.length === 0 && !loading && (
                        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                            <AlertCircle size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
                            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>No Application Found</h3>
                            <p style={{ color: '#64748b' }}>We couldn't find any loan application matching "{query}".</p>
                        </div>
                    )}

                    {!searched && (
                        <div style={{ padding: '2rem', background: '#eff6ff', borderRadius: '16px', border: '1px solid #dbeafe', display: 'flex', gap: '1rem' }}>
                            <Info size={24} color="#2563eb" style={{ flexShrink: 0 }} />
                            <div>
                                <h4 style={{ margin: '0 0 0.25rem 0', color: '#1e40af', fontWeight: 'bold' }}>Pro Tip</h4>
                                <p style={{ margin: 0, fontSize: '14px', color: '#1e40af', opacity: 0.8 }}>Searching by email will show all your previous applications, while ID shows a specific one.</p>
                            </div>
                        </div>
                    )}

                    {results.map(app => (
                        <div
                            key={app.applicationId}
                            onClick={() => navigate(`/result/${app.applicationId}`)}
                            style={{
                                background: 'white',
                                padding: '1.5rem',
                                borderRadius: '20px',
                                border: '1px solid #e2e8f0',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.borderColor = '#2563eb';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                                e.currentTarget.style.borderColor = '#e2e8f0';
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Loan ID</p>
                                    <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>#{app.applicationId}</p>
                                </div>
                                <div style={{ height: '40px', width: '1px', background: '#e2e8f0' }} />
                                <div>
                                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 4px 0' }}>₹{app.loanAmount.toLocaleString()}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
                                        <Calendar size={14} />
                                        <span>{new Date(app.appliedAt).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{app.loanPurpose}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={getStatusStyle(app.decision || app.status)}>
                                        {app.decision || app.status}
                                    </span>
                                    <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>Details <ArrowRight size={12} style={{ verticalAlign: 'middle' }} /></p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .spinner-small {
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}} />
        </div>
    );
}

const getStatusStyle = (status) => {
    const base = { padding: '6px 14px', borderRadius: '99px', fontSize: '13px', fontWeight: 'bold' };
    switch (status) {
        case 'APPROVED': return { ...base, background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' };
        case 'REJECTED': return { ...base, background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' };
        case 'MANUAL_REVIEW': return { ...base, background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' };
        default: return { ...base, background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' };
    }
};

export default TrackPage;
