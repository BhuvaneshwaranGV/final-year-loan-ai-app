import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Check, Shield, Database, Brain, MapPin } from 'lucide-react';

function ProcessingPage() {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([]);

    const steps = [
        { id: 1, text: 'Extracting 1.2M transactions from core banking...', icon: <Database size={18} /> },
        { id: 2, text: 'Calculating 9-pattern fraud vectors...', icon: <Shield size={18} /> },
        { id: 3, text: 'Running XGBoost risk prediction model...', icon: <Brain size={18} /> },
        { id: 4, text: 'Verifying Asset Ownership (Property)...', icon: <MapPin size={18} /> }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                const next = prev + 1;

                // Trigger step completions at specific progress points
                if (next === 25) setCompletedSteps([1]);
                if (next === 50) setCompletedSteps([1, 2]);
                if (next === 75) setCompletedSteps([1, 2, 3]);
                if (next === 95) setCompletedSteps([1, 2, 3, 4]);

                if (next >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        const applicationId = localStorage.getItem('lastApplicationId');
                        navigate(`/result/${applicationId}`);
                    }, 800);
                    return 100;
                }
                return next;
            });
        }, 60); // Total ~6 seconds

        return () => clearInterval(interval);
    }, [navigate]);

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0f172a', // Deep slate for AI theme
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            fontFamily: 'Inter, system-ui, sans-serif'
        }}>
            <div style={{
                background: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(12px)',
                borderRadius: '24px',
                padding: '3rem',
                maxWidth: '600px',
                width: '100%',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 2rem' }}>
                        <Loader2
                            size={100}
                            style={{ color: '#3b82f6', animation: 'spin 2s linear infinite' }}
                        />
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: '#3b82f6'
                        }}>
                            {progress}%
                        </div>
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '0.5rem' }}>AI Underwriting Engine</h1>
                    <p style={{ color: '#94a3b8' }}>Analyzing financial variables for near-instant approval</p>
                </div>

                {/* Diagnostic Checkboxes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                background: completedSteps.includes(step.id) ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.03)',
                                borderRadius: '12px',
                                border: '1px solid',
                                borderColor: completedSteps.includes(step.id) ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.05)',
                                transition: 'all 0.4s'
                            }}
                        >
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: completedSteps.includes(step.id) ? '#10b981' : 'transparent',
                                border: completedSteps.includes(step.id) ? 'none' : '2px solid #334155',
                                transition: 'all 0.4s'
                            }}>
                                {completedSteps.includes(step.id) ? <Check size={16} color="white" /> : null}
                            </div>
                            <div style={{ color: completedSteps.includes(step.id) ? '#e5e7eb' : '#94a3b8', fontSize: '15px' }}>
                                <span style={{ marginRight: '8px', opacity: 0.7 }}>{step.icon}</span>
                                {step.text}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{
                    marginTop: '3rem',
                    height: '4px',
                    background: '#1e293b',
                    borderRadius: '2px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                        transition: 'width 0.1s linear'
                    }} />
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}} />
            </div>
        </div>
    );
}

export default ProcessingPage;
