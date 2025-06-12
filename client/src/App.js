// client/src/App.js
import React, { useState, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import './App.css';
import './components/auth/Auth.css';

// Lazy load components for better performance
const CompanyList = React.lazy(() => import('./components/CompanyList'));
const EmailComposer = React.lazy(() => import('./components/EmailComposer'));
const StatusDashboard = React.lazy(() => import('./components/StatusDashboard'));
const Login = React.lazy(() => import('./components/auth/Login'));
const Register = React.lazy(() => import('./components/auth/Register'));
const Profile = React.lazy(() => import('./components/auth/Profile'));

// Loading component
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

// Main App Component
function AppContent() {
  const [emailResults, setEmailResults] = useState([]);
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardLayout emailResults={emailResults} setEmailResults={setEmailResults} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            {/* Default Redirect */}
            <Route 
              path="/" 
              element={
                isAuthenticated ? 
                <Navigate to="/dashboard" /> : 
                <Navigate to="/login" />
              } 
            />
            
            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

// Dashboard Layout Component
function DashboardLayout({ emailResults, setEmailResults }) {
  return (
    <div className="dashboard">
      <h1>Smart JobMailer 💌</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <CompanyList />
        <hr />
        <EmailComposer onSendComplete={setEmailResults} />
        <hr />
        <StatusDashboard results={emailResults} />
      </Suspense>
    </div>
  );
}

// App Wrapper with Auth Provider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
