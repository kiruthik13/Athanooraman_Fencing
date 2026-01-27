import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertTriangle, Info, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../common/Toast';
import GlassCard from '../common/GlassCard';
import PremiumButton from '../common/PremiumButton';
import AnimatedBackground from '../common/AnimatedBackground';

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
                const warningMsg = 'Identity verified, but failed to load profile protocols.';
                setRoleWarning(warningMsg);
                showToast(warningMsg, 'warning');
            } else {
                const userRole = role?.toLowerCase() || 'customer';
                if (userRole === 'admin') {
                    showToast('Admin detected. Redirecting to Command Center...', 'neutral');
                    navigate('/admin/dashboard', { replace: true });
                    return;
                }
                showToast(`Access Granted. Welcome to Athanuramman Fencing.`, 'success');
            }

            navigate('/customer/dashboard', { replace: true });

        } catch (err) {
            console.error('SignIn Trace:', err);
            setAuthError('Authentication protocol failure.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-950">
            <AnimatedBackground />

            <div className="w-full max-w-md relative z-10">
                <GlassCard dark className="animate-zoom-in shadow-2xl border-white/10 p-8 md:p-10">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden shadow-glow p-1 bg-gradient-to-tr from-premium-cyan to-premium-purple animate-float">
                            <img
                                src={logo}
                                alt="Athanuramman Fencing"
                                className="w-full h-full object-cover rounded-[14px]"
                            />
                        </div>
                        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
                            Identity <span className="gradient-text">Portal</span>
                        </h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Customer Infrastructure Access</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Messages */}
                        {authError && (
                            <div className="animate-shake p-4 bg-error-500/10 border border-error-500/20 rounded-xl flex items-start gap-3 text-error-400 text-sm">
                                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                <span>{authError}</span>
                            </div>
                        )}

                        {roleWarning && (
                            <div className="p-4 bg-warning-500/10 border border-warning-500/20 rounded-xl flex items-start gap-3 text-warning-400 text-sm">
                                <Info className="w-5 h-5 flex-shrink-0" />
                                <span>{roleWarning}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="w-5 h-5 text-slate-500 group-focus-within:text-premium-cyan transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-premium-cyan/50 focus:border-premium-cyan transition-all"
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-xs font-bold text-premium-cyan hover:glow-text transition-all"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-slate-500 group-focus-within:text-premium-cyan transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-premium-cyan/50 focus:border-premium-cyan transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <label className="flex items-center cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <div className={`w-5 h-5 border-2 rounded-md transition-all ${formData.rememberMe ? 'bg-premium-cyan border-premium-cyan' : 'border-white/20 bg-transparent'}`}>
                                        {formData.rememberMe && <ArrowRight className="w-4 h-4 text-slate-950 p-0.5" />}
                                    </div>
                                </div>
                                <span className="ml-3 text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">Remember my account</span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <PremiumButton
                            variant="primary"
                            loading={loading}
                            className="w-full py-4 text-slate-950 font-black animate-glow-pulse"
                            type="submit"
                        >
                            Sign In to Athanuramman Fencing
                        </PremiumButton>

                        {/* Sign Up Link */}
                        <p className="text-center text-slate-400 text-sm">
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="font-bold text-white hover:text-premium-cyan underline decoration-premium-cyan/30 underline-offset-4 transition-all"
                            >
                                Create Account
                            </Link>
                        </p>
                    </form>
                </GlassCard>

                {/* Footer Credits */}
                <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '800ms' }}>
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                        Athanuramman Fencing Premium Cloud Security
                    </p>
                </div>
            </div>

            {/* Background Decorative Blobs */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-premium-cyan/10 rounded-full blur-[100px] animate-blob"></div>
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-premium-purple/10 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
        </div>
    );
};

export default SignIn;
