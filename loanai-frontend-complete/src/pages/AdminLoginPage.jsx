import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLoginPage() {
    const navigate = useNavigate();
    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/admin/panel');
    };
    return (
        <div style={{ padding: '20px' }}>
            <h1>Admin Login</h1>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Admin ID" style={{ display: 'block', margin: '10px 0' }} />
                <input type="password" placeholder="Password" style={{ display: 'block', margin: '10px 0' }} />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default AdminLoginPage;
