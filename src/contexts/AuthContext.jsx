import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Helper to map auth errors to user-friendly messages
const getAuthErrorMessage = (errorCode) => {
    switch (errorCode) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            return 'Invalid email or password.';
        case 'auth/email-already-in-use':
            return 'An account with this email already exists.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters long.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection.';
        default:
            return 'An error occurred. Please try again.';
    }
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [roleLoadError, setRoleLoadError] = useState(false);

    // Robust helper to get user role safe against network errors
    const getUserRole = async (uid) => {
        try {
            const snap = await getDoc(doc(db, "users", uid));
            if (snap.exists()) {
                return snap.data();
            }
            return { role: "customer" }; // fallback if doc doesn't exist but DB is reachable
        } catch (error) {
            if (error.code === "unavailable" || error.message.includes('offline')) {
                console.log("Firestore offline, using fallback role");
                return { role: "customer", roleLoadError: true };
            }
            throw error;
        }
    };

    const signup = async (email, password, userData) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: userData.displayName
            });

            // Attempt to save to Firestore
            try {
                await setDoc(doc(db, 'users', user.uid), {
                    uid: user.uid,
                    email: email,
                    fullName: userData.displayName,
                    phone: userData.phone || '',
                    role: userData.role || 'customer',
                    createdAt: new Date().toISOString()
                });
            } catch (fsError) {
                console.warn('Firestore save failed during signup:', fsError);
            }

            const profile = {
                role: userData.role || 'customer',
                fullName: userData.displayName,
                phone: userData.phone || '',
                ...userData
            };
            setCurrentUser(user);
            setUserProfile(profile);

            return { user, success: true, error: null };
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: error.code, message: getAuthErrorMessage(error.code) };
        }
    };

    const signin = async (email, password) => {
        try {
            console.log(`🔐 Attempting login with: ${email}`);

            // 1. Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Fetch Role
            let profile = null;
            let loadError = false;

            try {
                const roleData = await getUserRole(user.uid);
                profile = roleData;
                if (roleData.roleLoadError) {
                    loadError = true;
                }
            } catch (fsError) {
                // If getUserRole threw something other than unavailable (which it catches), or unexpected
                console.error('Firestore error in signin:', fsError);
                // Fallback
                profile = { role: 'customer', email: user.email };
                loadError = true;
            }

            // 3. Update State
            setCurrentUser(user);
            setUserProfile(profile);
            setRoleLoadError(loadError);

            return {
                user,
                role: profile.role,
                error: null,
                roleLoadError: loadError
            };

        } catch (error) {
            console.error('Sign in error:', error.code, error.message);
            // Return error code to let UI handle the message logic as requested
            return {
                user: null,
                error: error.code,
                message: getAuthErrorMessage(error.code),
                roleLoadError: false
            };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setCurrentUser(null);
            setUserProfile(null);
            setRoleLoadError(false);
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { error: error.code };
        }
    };

    const resetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (error) {
            return { error: error.code, message: getAuthErrorMessage(error.code) };
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const profileData = await getUserRole(user.uid);
                    setCurrentUser(user);
                    setUserProfile(profileData);
                    setRoleLoadError(!!profileData.roleLoadError);
                } catch (error) {
                    console.error('Error fetching profile in onAuthStateChanged:', error);
                    // Fallback
                    setCurrentUser(user);
                    setUserProfile({ role: 'customer' });
                    setRoleLoadError(true);
                }
            } else {
                setCurrentUser(null);
                setUserProfile(null);
                setRoleLoadError(false);
            }
            setAuthLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userProfile,
        authLoading,
        roleLoadError,
        signup,
        signin,
        login: signin, // Alias if needed
        logout,
        resetPassword,
        // Helper booleans
        isAdmin: userProfile?.role === 'admin' || userProfile?.role === 'Admin',
        isCustomer: userProfile?.role === 'customer' || userProfile?.role === 'Customer'
    };

    return (
        <AuthContext.Provider value={value}>
            {!authLoading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
