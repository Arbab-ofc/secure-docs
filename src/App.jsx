import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';


import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';


import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import ErrorPage from './pages/ErrorPage';
import PublicDocument from './pages/PublicDocument';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Product from './pages/Product';
import Profile from './pages/Profile';
import ProfileEdit from './pages/ProfileEdit';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/AdminDashboard';


import Login from './components/auth/Login';
import Register from './components/auth/Register';
import OTPVerification from './components/auth/OTPVerification';


import Layout from './components/layout/Layout';
import ScrollManager from './components/common/ScrollManager';


import Loading from './components/common/Loading';


import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { useEffect } from 'react';


const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return user ? children : <Navigate to="/login" replace />;
};

const VerifiedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading, hasAdminAccess } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  if (!hasAdminAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};


const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return !user ? children : <Navigate to="/dashboard" replace />;
};



function AppContent() {
  const { loading } = useAuth();
  const { isDark } = useTheme();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
        <Router>
          <ScrollManager />
          <Routes>
            {}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="product" element={<Product />} />
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<TermsOfService />} />
              <Route path="shared/:documentId" element={<PublicDocument />} />
            </Route>

            {}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/verify-otp" element={
              <PublicRoute>
                <OTPVerification />
              </PublicRoute>
            } />
            <Route path="/forgot-password" element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } />

            {}
            <Route path="/verify-email" element={
              <ProtectedRoute>
                <VerifyEmail />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <VerifiedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </VerifiedRoute>
            } />
            <Route path="/profile" element={
              <VerifiedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </VerifiedRoute>
            } />
            <Route path="/profile/edit" element={
              <VerifiedRoute>
                <Layout>
                  <ProfileEdit />
                </Layout>
              </VerifiedRoute>
            } />
            <Route path="/admin" element={
              <AdminRoute>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </AdminRoute>
            } />

            {}
            <Route path="*" element={<ErrorPage />} />
          </Routes>

          {}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: isDark ? '#1e293b' : '#ffffff',
                color: isDark ? '#f1f5f9' : '#1e293b',
                border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                borderRadius: '0.75rem',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: isDark
                  ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                  : '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: isDark ? '#1e293b' : '#ffffff'
                }
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: isDark ? '#1e293b' : '#ffffff'
                }
              }
            }}
          />
        </Router>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
