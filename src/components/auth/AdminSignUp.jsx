import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../common/Toast';
import GlassCard from '../common/GlassCard';
import PremiumButton from '../common/PremiumButton';
import AnimatedBackground from '../common/AnimatedBackground';

import logo from '../../assets/logo.jpg';

const AdminSignUp = () => {
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
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.displayName.trim()) newErrors.displayName = 'Admin name required';
        if (!formData.email.trim()) newErrors.email = 'Email required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';

        if (!formData.password) newErrors.password = 'Password required';
        else if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';

        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Mismatch';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const result = await signup(
                formData.email.trim(),
                formData.password,
                {
                    displayName: formData.displayName.trim(),
                    phone: formData.phone.trim(),
                    role: 'admin'
                }
            );

            if (result.success) {
                showToast('Administrative Credentials Authorized!', 'success');
                navigate('/admin/dashboard', { replace: true });
            } else {
                showToast(result.message || 'Authorization failed', 'error');
            }
        } catch (error) {
            showToast('System protocol failure.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-950">
            <AnimatedBackground />

            <div className="w-full max-w-lg relative z-10">
                <GlassCard dark className="animate-zoom-in shadow-2xl border-white/10 p-8 md:p-10">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden shadow-glow p-1 bg-gradient-to-tr from-premium-purple to-premium-cyan animate-float">
                            <img src={logo} alt="Athanuramman Fencing Admin" className="w-full h-full object-cover rounded-[14px]" />
                        </div>
                        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
                            Command <span className="gradient-text">Registration</span>
                        </h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Initialize Admin Infrastructure</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-premium-purple" />
                                    <input
                                        type="text"
                                        name="displayName"
                                        value={formData.displayName}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-premium-purple/50 outline-none transition-all"
                                        placeholder="Full Name"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Phone</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-premium-purple" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-premium-purple/50 outline-none transition-all"
                                        placeholder="Optional"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Corporate Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-premium-purple" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-premium-purple/50 outline-none transition-all"
                                    placeholder="admin@athanurammanfencing.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Protocol</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-premium-purple" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900 border border-white/5 rounded-xl py-3 pl-12 pr-12 text-white focus:ring-2 focus:ring-premium-purple/50 outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm Protocol</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-premium-purple" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900 border border-white/5 rounded-xl py-3 pl-12 pr-12 text-white focus:ring-2 focus:ring-premium-purple/50 outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white">
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <PremiumButton
                            variant="primary"
                            loading={loading}
                            className="w-full py-4 bg-premium-purple text-white font-black rounded-xl"
                            type="submit"
                        >
                            Elevate to Administrative Status
                        </PremiumButton>

                        <p className="text-center text-slate-500 text-[10px] font-black uppercase tracking-widest">
                            Authorized Personnel Only — <Link to="/admin-login" className="text-premium-cyan">Back to Command Center</Link>
                        </p>
                    </form>
                </GlassCard>
            </div>

            <div className="absolute -top-20 -left-20 w-96 h-96 bg-premium-purple/10 rounded-full blur-[100px] animate-blob"></div>
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-premium-cyan/10 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
        </div>
    );
};

export default AdminSignUp;
