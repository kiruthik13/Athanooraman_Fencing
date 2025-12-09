import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertTriangle, Info, Facebook, Instagram, Youtube } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../common/Toast';

import logo from '../../assets/logo.jpg';

const SignIn = () => {
    const navigate = useNavigate();
    const { signin } = useAuth();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [roleWarning, setRoleWarning] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear errors/warnings when user types
        setAuthError(null);
        setRoleWarning(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        if (!formData.email || !formData.password) {
            setAuthError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setAuthError(null);
        setRoleWarning(null);

        try {
            console.log(`🔐 Attempting login with: ${formData.email}`);

            const { error, roleLoadError, role } = await signin(formData.email.trim(), formData.password);

            if (error) {
                // Map Auth errors for UI
                if ([
                    'auth/invalid-credential',
                    'auth/user-not-found',
                    'auth/wrong-password'
                ].includes(error)) {
                    setAuthError('Invalid email or password');
                } else {
                    // For any other auth/* error
                    setAuthError('Login failed. Please try again.');
                }
                setLoading(false);
                return;
            }

            // Successful Login

            // Check for role load error (non-blocking)
            if (roleLoadError) {
                const warningMsg = 'Logged in, but failed to load role info. Some features may be limited.';
                setRoleWarning(warningMsg);
                showToast(warningMsg, 'warning');
            } else {
                showToast('Login successful!', 'success');
            }

            // Navigate based on role
            // Using the role returned from signin (or fallback context/default)
            // Normalizing role string just in case
            const userRole = role?.toLowerCase() || 'customer';

            console.log(`🚀 Navigating to ${userRole} dashboard...`);

            // Short delay to let state settle or just go immediately (usually fine in React Router 6)
            if (userRole === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                // Default to customer dashboard
                navigate('/customer/dashboard', { replace: true });
            }

        } catch (err) {
            console.error('❌ Unexpected error in SignIn:', err);
            setAuthError('An unexpected error occurred.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent flex items-center justify-center p-4 relative overflow-hidden">
            {/* Pulsing Background Blobs */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-neon-blue/20 rounded-full blur-[100px] animate-pulse-fast"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[100px] animate-pulse-fast delay-700"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] animate-pulse"></div>

            <div className="w-full max-w-md animate-slide-in relative z-10">
                <div className="text-center mb-8 flex flex-col items-center">
                    <div className="relative w-24 h-24 mb-4 group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue to-neon-purple rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-fast"></div>
                        <img
                            src={logo}
                            alt="JustFence Logo"
                            className="relative w-full h-full object-cover rounded-full border-2 border-white/20 shadow-neon"
                        />
                    </div>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple text-glow mb-2">Athanuramman Fencing</h1>
                    <p className="text-gray-400">Sign in to your account</p>
                </div>

                <div className="glass-panel p-8 rounded-2xl border border-neon-blue/20 shadow-neon animate-float-6s">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Alert */}
                        {authError && (
                            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-lg flex items-start gap-3 animate-fade-in">
                                <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                                <p className="text-sm text-red-300">{authError}</p>
                            </div>
                        )}

                        {/* Warning Alert */}
                        {roleWarning && (
                            <div className="bg-yellow-500/10 border border-yellow-500/50 p-4 rounded-lg flex items-start gap-3 animate-fade-in">
                                <Info className="h-5 w-5 text-yellow-400 mt-0.5" />
                                <p className="text-sm text-yellow-300">{roleWarning}</p>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-neon-blue transition-colors w-5 h-5" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input pl-10 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-neon-blue focus:shadow-neon"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-neon-purple transition-colors w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-neon-purple focus:shadow-neon-purple"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded bg-white/10 border-white/20 text-neon-blue focus:ring-neon-blue focus:ring-offset-0 focus:ring-offset-transparent"
                                />
                                <span className="ml-2 text-sm text-gray-400 hover:text-gray-300 transition-colors">Remember me</span>
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-neon-blue hover:text-neon-purple transition-colors font-medium hover:underline decoration-neon-purple/30"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn btn-primary py-3 text-lg font-bold flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 translate-x-[-100%] group-hover:translate-x-100 transition-transform duration-700"></div>
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span className="text-glow">Signing In...</span>
                                </>
                            ) : (
                                <span className="text-glow">Sign In</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-neon-blue hover:text-neon-purple font-medium transition-colors hover:underline decoration-neon-purple/30">
                                Sign Up
                            </Link>
                        </p>
                    </div>

                    {/* Social Media Contact Links */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-sm text-gray-500 text-center mb-4">Connect with us</p>
                        <div className="flex justify-center space-x-6">
                            <a
                                href="https://youtube.com/@athanurammanfencings786?si=8kzeI9yIqdNz3g4J"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-red-500 transition-colors duration-300 hover:scale-110 transform"
                                title="YouTube"
                            >
                                <Youtube className="w-6 h-6" />
                            </a>
                            <a
                                href="https://www.facebook.com/nakulkupppusamy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-blue-500 transition-colors duration-300 hover:scale-110 transform"
                                title="Facebook"
                            >
                                <Facebook className="w-6 h-6" />
                            </a>
                            <a
                                href="https://www.instagram.com/athanurammanfencings?igsh=ejlybTd6ZGN2eThu"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-pink-500 transition-colors duration-300 hover:scale-110 transform"
                                title="Instagram"
                            >
                                <Instagram className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
