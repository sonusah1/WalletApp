import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import HomePage from './pages/HomePage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import TransferMoney from './pages/TransferMoney';
import RequestMoney from './pages/RequestMoney';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Components
import ProtectedRoute from './Component/auth/ProtectedRoute';
import ScrollToTop from './Component/common/ScrollToTop';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  const [showAuth, setShowAuth] = useState(false);
  
  useEffect(() => {
    // Show auth modal after 5 minutes of browsing
    const timer = setTimeout(() => {
      const isAuthenticated = localStorage.getItem('user');
      if (!isAuthenticated) {
        setShowAuth(true);
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <ScrollToTop />
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage showAuth={showAuth} setShowAuth={setShowAuth} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/transfer" element={<ProtectedRoute><TransferMoney /></ProtectedRoute>} />
        <Route path="/request" element={<ProtectedRoute><RequestMoney /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
        
        {/* Fallback routes */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;