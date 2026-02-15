import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Authentication APIs
export const authAPI = {
  login: (username, password) =>
    api.post('/auth/login', { username, password }),

  verifyAccount: (accountNumber) =>
    api.post('/account/verify', { accountNumber }),

  sendOTP: (accountNumber, email) =>
    api.post('/otp/send', { accountNumber, email }),

  verifyOTP: (accountNumber, otp) =>
    api.post('/otp/verify', { accountNumber, otp })
};

// Loan APIs
export const loanAPI = {
  submitApplication: (applicationData) =>
    api.post('/loan/apply', applicationData),

  getById: (id) =>
    api.get(`/loan/${id}`),

  track: (params) =>
    api.get('/loan/track', { params }),

  getStats: () =>
    api.get('/loan/dashboard/stats')
};

// Admin APIs
export const adminAPI = {
  getPendingReviews: () =>
    api.get('/admin/pending-reviews'),

  makeDecision: (id, decision, reviewerName, comments) =>
    api.put(`/admin/loans/${id}/decision`, {
      decision,
      reviewerName,
      comments
    }),

  getAllApplications: (filters) =>
    api.get('/admin/applications', { params: filters })
};

// Chat API
export const chatAPI = {
  sendMessage: (message) =>
    api.post('/chat/send', { message })
};

// Fraud API
export const fraudAPI = {
  getStats: () =>
    api.get('/fraud/stats')
};

export default api;
