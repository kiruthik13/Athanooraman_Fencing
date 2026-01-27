import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../common/Toast';
import GlassCard from '../common/GlassCard';
import PremiumButton from '../common/PremiumButton';
import AnimatedBackground from '../common/AnimatedBackground';

import logo from '../../assets/logo.jpg';

const SignUp = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.displayName.trim()) {
            newErrors.displayName = 'Full name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showToast('Please correct the errors in the form', 'error');
            return;
        }

        setLoading(true);

        try {
            const result = await signup(
                formData.email.trim(),
                formData.password,
                {
                    displayName: formData.displayName.trim(),
                    phone: formData.phone.trim(),
                    role: 'customer'
                }
            );

            if (result.success) {
                showToast('Customer identity established!', 'success');
                navigate('/customer/dashboard', { replace: true });
            } else {
                showToast(result.message || 'Identity creation failed', 'error');
            }
        } catch (error) {
            showToast('Protocol error during registration.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-950">
            <AnimatedBackground />

            <div className="w-full max-w-lg relative z-10">
                <GlassCard dark className="animate-zoom-in shadow-2xl border-white/10 p-8 md:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden shadow-glow p-1 bg-gradient-to-tr from-premium-cyan to-premium-purple animate-float">
                            <img
                                src={logo}
                                alt="Athanuramman Fencing"
                                className="w-full h-full object-cover rounded-[14px]"
                            />
                        </div>
                        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
                            Identity <span className="gradient-text">Hub</span>
                        </h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Register New Client Infrastructure</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="w-5 h-5 text-slate-500 group-focus-within:text-premium-cyan transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        name="displayName"
                                        value={formData.displayName}
                                        onChange={handleChange}
                                        className={`w-full bg-white/5 border ${errors.displayName ? 'border-error-500/50' : 'border-white/10'} rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-premium-cyan/50 focus:border-premium-cyan transition-all`}
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                {errors.displayName && <p className="text-[10px] font-bold text-error-400 ml-1 uppercase">{errors.displayName}</p>}
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Phone className="w-5 h-5 text-slate-500 group-focus-within:text-premium-cyan transition-colors" />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`w-full bg-white/5 border ${errors.phone ? 'border-error-500/50' : 'border-white/10'} rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-premium-cyan/50 focus:border-premium-cyan transition-all`}
                                        placeholder="1234567890"
                                        required
                                    />
                                </div>
                                {errors.phone && <p className="text-[10px] font-bold text-error-400 ml-1 uppercase">{errors.phone}</p>}
                            </div>
                        </div>

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
                                    className={`w-full bg-white/5 border ${errors.email ? 'border-error-500/50' : 'border-white/10'} rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-premium-cyan/50 focus:border-premium-cyan transition-all`}
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                            {errors.email && <p className="text-[10px] font-bold text-error-400 ml-1 uppercase">{errors.email}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-slate-500 group-focus-within:text-premium-cyan transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full bg-white/5 border ${errors.password ? 'border-error-500/50' : 'border-white/10'} rounded-xl py-3 pl-12 pr-12 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-premium-cyan/50 focus:border-premium-cyan transition-all`}
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
                                {errors.password && <p className="text-[10px] font-bold text-error-400 ml-1 uppercase">{errors.password}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirm</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-slate-500 group-focus-within:text-premium-cyan transition-colors" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`w-full bg-white/5 border ${errors.confirmPassword ? 'border-error-500/50' : 'border-white/10'} rounded-xl py-3 pl-12 pr-12 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-premium-cyan/50 focus:border-premium-cyan transition-all`}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-[10px] font-bold text-error-400 ml-1 uppercase">{errors.confirmPassword}</p>}
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex gap-3 items-start">
                            <ShieldCheck className="w-5 h-5 text-premium-cyan flex-shrink-0 mt-0.5" />
                            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                                By creating an account, you agree to our <Link to="/terms" className="text-white hover:text-premium-cyan underline decoration-white/20 underline-offset-2">Terms of Service</Link> and <span className="text-white cursor-pointer hover:text-premium-cyan underline decoration-white/20 underline-offset-2">Privacy Policy</span>.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <PremiumButton
                            variant="primary"
                            loading={loading}
                            className="w-full py-4 text-slate-950 font-black animate-glow-pulse"
                            type="submit"
                        >
                            Create Premium Account
                        </PremiumButton>

                        {/* Sign In Link */}
                        <p className="text-center text-slate-400 text-sm">
                            Already have an account?{' '}
                            <Link
                                to="/signin"
                                className="font-bold text-white hover:text-premium-cyan underline decoration-premium-cyan/30 underline-offset-4 transition-all"
                            >
                                Sign In
                            </Link>
                        </p>
                    </form>
                </GlassCard>

                {/* Footer Credits */}
                <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '800ms' }}>
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                        SECURE AES-256 ENCRYPTION ENABLED
                    </p>
                </div>
            </div>

            {/* Background Decorative Blobs */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-premium-cyan/10 rounded-full blur-[100px] animate-blob"></div>
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-premium-purple/10 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[150px] -z-10"></div>
        </div>
    );
};

export default SignUp;
