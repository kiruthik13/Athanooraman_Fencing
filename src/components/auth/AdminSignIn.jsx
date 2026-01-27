import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertTriangle, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../common/Toast';
import GlassCard from '../common/GlassCard';
import PremiumButton from '../common/PremiumButton';
import AnimatedBackground from '../common/AnimatedBackground';

import logo from '../../assets/logo.jpg';

const AdminSignIn = () => {
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setAuthError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        if (!formData.email || !formData.password) {
            setAuthError('Please fill in all security credentials');
            return;
        }

        setLoading(true);
        setAuthError(null);

        try {
            const { error, role } = await signin(formData.email.trim(), formData.password);

            if (error) {
                setAuthError('Unauthorized access or invalid credentials');
                setLoading(false);
                return;
            }

            const userRole = role?.toLowerCase() || 'customer';

            if (userRole !== 'admin') {
                setAuthError('Access Denied: This portal is reserved for Administrative Personnel only.');
                setLoading(false);
                return;
            }

            showToast('Administrative Access Granted. Welcome to Command Center.', 'success');
            navigate('/admin/dashboard', { replace: true });

        } catch (err) {
            console.error('Admin Auth Error:', err);
            setAuthError('An architectural system error occurred during authentication.');
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
                        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden shadow-glow p-1 bg-gradient-to-tr from-premium-purple to-premium-cyan animate-float">
                            <img
                                src={logo}
                                alt="Athanuramman Fencing Admin"
                                className="w-full h-full object-cover rounded-[14px]"
                            />
                        </div>
                        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
                            Command <span className="gradient-text">Center</span>
                        </h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Administrative Infrastructure Access</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Messages */}
                        {authError && (
                            <div className="animate-shake p-4 bg-error-500/10 border border-error-500/20 rounded-xl flex items-start gap-3 text-error-400 text-sm">
                                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                <span className="font-bold leading-tight">{authError}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin Identity (Email)</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="w-5 h-5 text-slate-600 group-focus-within:text-premium-purple transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-premium-purple/50 focus:border-premium-purple transition-all font-medium"
                                        placeholder="admin@athanurammanfencing.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Protocol (Password)</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-slate-600 group-focus-within:text-premium-purple transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-premium-purple/50 focus:border-premium-purple transition-all font-medium"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-600 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <PremiumButton
                            variant="primary"
                            loading={loading}
                            className="w-full py-4 bg-premium-purple text-white font-black shadow-glow-purple border-none rounded-xl"
                            type="submit"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <ShieldCheck className="w-5 h-5" />
                                Authorize Access
                            </span>
                        </PremiumButton>

                        <div className="text-center space-y-4">
                            <button
                                type="button"
                                onClick={() => navigate('/admin-signup')}
                                className="text-[10px] font-black text-premium-purple uppercase tracking-widest hover:glow-text transition-all"
                            >
                                Register New Admin Identity
                            </button>
                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={() => navigate('/signin')}
                                    className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-premium-cyan transition-colors"
                                >
                                    Switch to Client Identity Portal
                                </button>
                            </div>
                        </div>
                    </form>
                </GlassCard>

                {/* Footer Credits */}
                <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '800ms' }}>
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">
                        Athanuramman Fencing Enterprise Security Protocol v4.0.2
                    </p>
                </div>
            </div>

            {/* Background Decorative Blobs */}
            <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-premium-purple/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-premium-cyan/5 rounded-full blur-[120px] animate-pulse animation-delay-2000"></div>
        </div>
    );
};

export default AdminSignIn;
