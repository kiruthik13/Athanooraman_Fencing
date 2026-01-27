import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, Sparkles, Send } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../common/Toast';
import GlassCard from '../common/GlassCard';
import PremiumButton from '../common/PremiumButton';
import AnimatedBackground from '../common/AnimatedBackground';

import logo from '../../assets/logo.jpg';

const ForgotPassword = () => {
    const { resetPassword } = useAuth();
    const { showToast } = useToast();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            showToast('Please enter your email address', 'error');
            return;
        }

        setLoading(true);

        try {
            const result = await resetPassword(email);

            if (result.success) {
                setEmailSent(true);
                showToast('Password reset email sent successfully', 'success');
            } else {
                showToast(result.error || 'Failed to send reset email', 'error');
            }
        } catch (error) {
            showToast('An error occurred. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-950">
                <AnimatedBackground />

                <div className="w-full max-w-md relative z-10">
                    <GlassCard dark className="animate-zoom-in text-center p-10 border-white/10">
                        <div className="w-20 h-20 bg-premium-cyan/20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-glow border border-premium-cyan/30 animate-float">
                            <CheckCircle className="w-10 h-10 text-premium-cyan" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
                            Check Your <span className="gradient-text">Email</span>
                        </h2>
                        <p className="text-slate-400 mb-10 leading-relaxed">
                            We've sent a luxury-grade secure password reset link to <br />
                            <strong className="text-white font-bold">{email}</strong>
                        </p>

                        <Link to="/signin" className="block w-full">
                            <PremiumButton variant="outline" className="w-full py-4 font-black">
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Back to Sign In
                            </PremiumButton>
                        </Link>
                    </GlassCard>
                </div>

                {/* Background Decorative Blobs */}
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-premium-cyan/10 rounded-full blur-[100px] animate-blob"></div>
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-premium-purple/10 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-950">
            <AnimatedBackground />

            <div className="w-full max-w-md relative z-10">
                {/* Back Link */}
                <Link
                    to="/signin"
                    className="inline-flex items-center gap-2 text-xs font-black text-slate-500 hover:text-premium-cyan uppercase tracking-widest transition-all mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Sign In
                </Link>

                <GlassCard dark className="animate-zoom-in shadow-2xl border-white/10 p-10">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl overflow-hidden shadow-glow p-1 bg-gradient-to-tr from-premium-cyan to-premium-purple animate-float">
                            <img
                                src={logo}
                                alt="Athanuramman Fencing"
                                className="w-full h-full object-cover rounded-[14px]"
                            />
                        </div>
                        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
                            Reset <span className="gradient-text">Password</span>
                        </h1>
                        <p className="text-slate-400 text-sm font-medium">
                            Securely recover your Athanuramman Fencing account access
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-slate-500 group-focus-within:text-premium-cyan transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-premium-cyan/50 focus:border-premium-cyan transition-all"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <PremiumButton
                            variant="primary"
                            loading={loading}
                            className="w-full py-4 text-slate-950 font-black animate-glow-pulse"
                            type="submit"
                        >
                            {!loading && <Send className="w-5 h-5 mr-2" />}
                            Send Reset Link
                        </PremiumButton>
                    </form>
                </GlassCard>

                {/* Footer Credits */}
                <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '800ms' }}>
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                        SECURE IDENTITY RECOVERY PROTOCOL
                    </p>
                </div>
            </div>

            {/* Background Decorative Blobs */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-premium-cyan/10 rounded-full blur-[100px] animate-blob"></div>
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-premium-purple/10 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
        </div>
    );
};

export default ForgotPassword;
