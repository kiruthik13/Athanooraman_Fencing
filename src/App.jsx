import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import ForgotPassword from './components/auth/ForgotPassword';

// Common Pages
import TermsConditions from './components/common/TermsConditions';

// Customer Pages
import CustomerLayout from './components/customer/CustomerLayout';
import Products from './components/customer/Products';
import MyProjects from './components/customer/MyProjects';
import Calculator from './components/customer/Calculator';
import MyQuotes from './components/customer/MyQuotes';
import Profile from './components/customer/Profile';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import ProductsAdmin from './components/admin/Products';
import Quotes from './components/admin/Quotes';
import ProjectsAdmin from './components/admin/Projects';
import Customers from './components/admin/Customers';
import Reports from './components/admin/Reports';
import Settings from './components/admin/Settings';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/terms" element={<TermsConditions />} />

          {/* Customer Routes */}
          <Route
            path="/customer"
            element={
              <ProtectedRoute requiredRole="Customer">
                <CustomerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/customer/dashboard" replace />} />
            <Route path="dashboard" element={<Products />} />
            <Route path="projects" element={<MyProjects />} />
            <Route path="calculator" element={<Calculator />} />
            <Route path="quotes" element={<MyQuotes />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="Admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="quotes" element={<Quotes />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="customers" element={<Customers />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
