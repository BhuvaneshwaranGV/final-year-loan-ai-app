import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AccountVerifyPage from './pages/AccountVerifyPage';
import LoanApplicationPage from './pages/LoanApplicationPage';
import ProcessingPage from './pages/ProcessingPage';
import ResultPage from './pages/ResultPage';
import TrackPage from './pages/TrackPage';
import DashboardPage from './pages/DashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPanelPage from './pages/AdminPanelPage';
import FraudDetectionPage from './pages/FraudDetectionPage';
import Chatbot from './components/Chatbot';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/account-verify" element={<AccountVerifyPage />} />
          <Route path="/apply" element={<LoanApplicationPage />} />
          <Route path="/processing" element={<ProcessingPage />} />
          <Route path="/result/:id" element={<ResultPage />} />
          <Route path="/track" element={<TrackPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/fraud-detection" element={<FraudDetectionPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/panel" element={<AdminPanelPage />} />
        </Routes>

        {/* Floating Chatbot on all pages */}
        <Chatbot />
      </div>
    </BrowserRouter>
  );
}

export default App;
