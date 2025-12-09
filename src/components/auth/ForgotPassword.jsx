import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../common/Toast';

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

        if (!/\S+@\S+\.\S+/.test(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }

        setLoading(true);

        const result = await resetPassword(email);

        setLoading(false);

        if (result.success) {
            setEmailSent(true);
            showToast('Password reset link sent to your email', 'success');
        } else {
            showToast(result.error || 'Failed to send reset link', 'error');
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
                <div className="w-full max-w-md animate-slide-in">
                    <div className="glass-panel text-center p-8 rounded-2xl border border-neon-blue/20 shadow-neon">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full mb-6 border border-green-500/30 animate-pulse-fast">
                            <CheckCircle className="w-10 h-10 text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 text-glow">Check Your Email</h2>
                        <p className="text-gray-300 mb-6">
                            We've sent a password reset link to <strong className="text-neon-blue">{email}</strong>
                        </p>
                        <p className="text-sm text-gray-400 mb-8">
                            Please check your inbox and click the link to reset your password.
                        </p>
                        <Link to="/signin" className="btn btn-primary inline-block w-full text-center">
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-slide-in">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple text-glow mb-2">Athanuramman Fencing</h1>
                    <p className="text-gray-400">Reset your password</p>
                </div>

                <div className="glass-panel p-8 rounded-2xl border border-neon-blue/20 shadow-neon">
                    <div className="mb-6 text-center">
                        <h2 className="text-xl font-bold text-white mb-2">Forgot Password?</h2>
                        <p className="text-gray-400 text-sm">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-neon-blue transition-colors w-5 h-5" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input pl-10 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-neon-blue focus:shadow-neon"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
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
                                    <span className="text-glow">Sending...</span>
                                </>
                            ) : (
                                <span className="text-glow">Send Reset Link</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center bg-white/5 mx-[-2rem] mb-[-2rem] rounded-b-2xl p-4 border-t border-white/10">
                        <Link
                            to="/signin"
                            className="flex items-center justify-center text-neon-blue hover:text-neon-purple font-medium transition-colors hover:underline decoration-neon-purple/30 group"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
