import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertTriangle, Info, Facebook, Instagram, Youtube, Sparkles, ArrowRight } from 'lucide-react';
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
    const [focusedField, setFocusedField] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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
                if ([
                    'auth/invalid-credential',
                    'auth/user-not-found',
                    'auth/wrong-password'
                ].includes(error)) {
                    setAuthError('Invalid email or password');
                } else {
                    setAuthError('Login failed. Please try again.');
                }
                setLoading(false);
                return;
            }

            if (roleLoadError) {
                const warningMsg = 'Logged in, but failed to load role info. Some features may be limited.';
                setRoleWarning(warningMsg);
                showToast(warningMsg, 'warning');
            } else {
                const userRole = role?.toLowerCase() || 'customer';
                const roleDisplay = userRole.charAt(0).toUpperCase() + userRole.slice(1);
                showToast(`✅ Login successful! Welcome ${roleDisplay}`, 'success');
            }

            const userRole = role?.toLowerCase() || 'customer';
            console.log(`🚀 Navigating to ${userRole} dashboard...`);

            if (userRole === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/customer/dashboard', { replace: true });
            }

        } catch (err) {
            console.error('❌ Unexpected error in SignIn:', err);
            setAuthError('An unexpected error occurred.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent flex items-center justify-center p-6 relative overflow-hidden">
            {/* Animated Gradient Mesh Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-neon-blue/30 via-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse-fast opacity-60"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-neon-purple/30 via-pink-500/20 to-transparent rounded-full blur-3xl animate-pulse-fast delay-700 opacity-60"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-spin-slow opacity-40"></div>

                {/* Floating Particles */}
                <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-neon-blue rounded-full animate-levitate opacity-70"></div>
                <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-neon-purple rounded-full animate-levitate delay-700 opacity-70"></div>
                <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-cyan-400 rounded-full animate-levitate delay-300 opacity-70"></div>
            </div>

            <div className="w-full max-w-[480px] animate-slide-in relative z-10">
                {/* Header Section */}
                <div className="text-center mb-10 flex flex-col items-center">
                    <div className="relative w-28 h-28 mb-6 group">
                        {/* Glowing Ring Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue via-purple-500 to-neon-purple rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse-fast scale-110"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full blur-md opacity-75 animate-glow"></div>

                        {/* Logo Container */}
                        <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/30 shadow-[0_0_30px_rgba(0,243,255,0.5)] group-hover:shadow-[0_0_50px_rgba(189,0,255,0.7)] transition-all duration-500 group-hover:scale-105 transform">
                            <img
                                src={logo}
                                alt="Athanuramman Fencing Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Sparkle Effect */}
                        <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                    </div>

                    <h1 className="text-5xl font-bold mb-3 relative">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-purple-400 to-neon-purple animate-glow">
                            Athanuramman Fencing
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg font-light tracking-wide">Welcome back! Please sign in</p>
                </div>

                {/* Main Card with 3D Effect */}
                <div className="relative group">
                    {/* 3D Shadow Layers */}
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 rounded-3xl blur-xl transform translate-y-2 translate-x-2 opacity-50"></div>
                    <div className="absolute inset-0 bg-gradient-to-tl from-purple-500/5 to-cyan-500/5 rounded-3xl blur-lg transform -translate-y-1 -translate-x-1 opacity-30"></div>

                    {/* Main Glass Panel */}
                    <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,243,255,0.2)] p-10 hover:shadow-[0_8px_48px_0_rgba(189,0,255,0.3)] transition-all duration-500 animate-float-6s">
                        {/* Top Accent Line */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent rounded-full"></div>

                        <form onSubmit={handleSubmit} className="space-y-7">
                            {/* Error Alert */}
                            {authError && (
                                <div className="bg-gradient-to-r from-red-500/25 to-red-600/25 border-2 border-red-500/60 p-4 rounded-2xl flex items-start gap-3 animate-fade-in backdrop-blur-sm shadow-[0_4px_20px_rgba(239,68,68,0.2)]">
                                    <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-red-200 font-medium">{authError}</p>
                                </div>
                            )}

                            {/* Warning Alert */}
                            {roleWarning && (
                                <div className="bg-gradient-to-r from-yellow-500/25 to-orange-500/25 border-2 border-yellow-500/60 p-4 rounded-2xl flex items-start gap-3 animate-fade-in backdrop-blur-sm shadow-[0_4px_20px_rgba(234,179,8,0.2)]">
                                    <Info className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-yellow-200 font-medium">{roleWarning}</p>
                                </div>
                            )}

                            {/* Email Field with Floating Label */}
                            <div className="relative">
                                <div className="relative group/input">
                                    <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${focusedField === 'email' ? 'text-neon-blue scale-110' : 'text-gray-500'
                                        }`} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-transparent focus:border-neon-blue focus:bg-white/10 transition-all duration-300 focus:shadow-[0_0_20px_rgba(0,243,255,0.3)] peer"
                                        placeholder="Email Address"
                                        required
                                    />
                                    <label className={`absolute left-12 transition-all duration-300 pointer-events-none ${formData.email || focusedField === 'email'
                                        ? '-top-3 left-3 text-xs bg-gradient-to-r from-neon-blue to-cyan-400 bg-clip-text text-transparent font-semibold px-2'
                                        : 'top-1/2 -translate-y-1/2 text-gray-400'
                                        }`}>
                                        Email Address
                                    </label>
                                </div>
                            </div>

                            {/* Password Field with Floating Label */}
                            <div className="relative">
                                <div className="relative group/input">
                                    <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${focusedField === 'password' ? 'text-neon-purple scale-110' : 'text-gray-500'
                                        }`} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full pl-12 pr-12 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-transparent focus:border-neon-purple focus:bg-white/10 transition-all duration-300 focus:shadow-[0_0_20px_rgba(189,0,255,0.3)] peer"
                                        placeholder="Password"
                                        required
                                    />
                                    <label className={`absolute left-12 transition-all duration-300 pointer-events-none ${formData.password || focusedField === 'password'
                                        ? '-top-3 left-3 text-xs bg-gradient-to-r from-neon-purple to-pink-400 bg-clip-text text-transparent font-semibold px-2'
                                        : 'top-1/2 -translate-y-1/2 text-gray-400'
                                        }`}>
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between pt-2">
                                <label className="flex items-center cursor-pointer group/check">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded-md bg-white/10 border-2 border-white/20 text-neon-blue focus:ring-2 focus:ring-neon-blue focus:ring-offset-0 transition-all duration-300 cursor-pointer"
                                    />
                                    <span className="ml-3 text-sm text-gray-300 group-hover/check:text-white transition-colors font-medium">Remember me</span>
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent hover:from-neon-purple hover:to-neon-blue transition-all duration-300 font-semibold relative group/link"
                                >
                                    Forgot Password?
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-blue to-neon-purple group-hover/link:w-full transition-all duration-300"></span>
                                </Link>
                            </div>

                            {/* Premium Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="relative w-full mt-8 py-4 rounded-xl font-bold text-lg overflow-hidden group/btn disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {/* Animated Background Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-purple-500 to-neon-purple"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple via-pink-500 to-neon-blue opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>

                                {/* Shimmer Effect */}
                                <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>

                                {/* Button Content */}
                                <div className="relative flex items-center justify-center gap-3 text-white">
                                    {loading ? (
                                        <>
                                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span className="tracking-wide">Signing In...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="tracking-wide">Sign In</span>
                                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>

                        {/* Sign Up Link */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-400 text-sm">
                                Don't have an account?{' '}
                                <Link
                                    to="/signup"
                                    className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent font-bold hover:from-neon-purple hover:to-neon-blue transition-all duration-300 relative group/signup"
                                >
                                    Sign Up
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-neon-blue to-neon-purple scale-x-0 group-hover/signup:scale-x-100 transition-transform duration-300"></span>
                                </Link>
                            </p>
                        </div>

                        {/* Social Media Links */}
                        <div className="mt-8 pt-8 border-t border-white/10">
                            <p className="text-sm text-gray-500 text-center mb-5 font-medium tracking-wide">Connect with us</p>
                            <div className="flex justify-center gap-5">
                                <a
                                    href="https://youtube.com/@athanurammanfencings786?si=8kzeI9yIqdNz3g4J"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/social relative p-3 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/50 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(255,0,0,0.3)]"
                                    title="YouTube"
                                >
                                    <Youtube className="w-6 h-6 text-gray-400 group-hover/social:text-red-500 transition-colors duration-300" />
                                </a>
                                <a
                                    href="https://www.facebook.com/nakulkupppusamy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/social relative p-3 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                                    title="Facebook"
                                >
                                    <Facebook className="w-6 h-6 text-gray-400 group-hover/social:text-blue-500 transition-colors duration-300" />
                                </a>
                                <a
                                    href="https://www.instagram.com/athanurammanfencings?igsh=ejlybTd6ZGN2eThu"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/social relative p-3 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                                    title="Instagram"
                                >
                                    <Instagram className="w-6 h-6 text-gray-400 group-hover/social:text-pink-500 transition-colors duration-300" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
