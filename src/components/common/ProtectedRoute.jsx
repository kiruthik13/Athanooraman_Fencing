import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { currentUser, userProfile, authLoading } = useAuth();

    // Show loading spinner while Firebase Auth initializes
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner text="Loading..." />
            </div>
        );
    }

    // If user not logged in, redirect to signin
    if (!currentUser) {
        return <Navigate to="/signin" replace />;
    }

    // If route requires a specific role and user doesn't have it
    // We check userProfile.role. If userProfile is missing (rare if auth is done, but possible if context update lags),
    // we might want to wait or fail safe. The AuthContext ensures userProfile is set if currentUser is set.
    const userRole = userProfile?.role; // 'admin' or 'customer' (case insensitive usually, but let's normalize if needed)

    if (requiredRole) {
        // Normalize comparison (assuming roles are stored as 'admin'/'customer' or 'Admin'/'Customer')
        // Let's be case-insensitive to be safe
        const currentRoleLower = userRole?.toLowerCase();
        const requiredRoleLower = requiredRole?.toLowerCase();

        if (currentRoleLower !== requiredRoleLower) {
            // Redirect to appropriate dashboard based on user's actual role
            if (currentRoleLower === 'admin') {
                return <Navigate to="/admin/dashboard" replace />;
            } else {
                return <Navigate to="/customer/dashboard" replace />;
            }
        }
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
