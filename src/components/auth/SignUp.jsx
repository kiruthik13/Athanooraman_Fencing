import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, UserCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../common/Toast';

const SignUp = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        location: 'Bangalore',
        password: '',
        confirmPassword: '',
        role: 'Customer',
        terms: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const locations = ['Coimbatore', 'Erode', 'Tirupur', 'Chennai', 'Madurai', 'Bangalore', 'Hyderabad', 'Mumbai'];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\+91\s\d{5}\s\d{5}$/.test(formData.phone)) {
            newErrors.phone = 'Phone format: +91 XXXXX XXXXX';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.terms) {
            newErrors.terms = 'You must agree to the Terms and Conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getPasswordStrength = () => {
        const password = formData.password;
        if (!password) return { strength: 0, label: '', color: '' };

        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;

        const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
        const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

        return { strength, label: labels[Math.min(strength, 4)], color: colors[Math.min(strength, 4)] };
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.startsWith('91')) {
            value = value.slice(2);
        }
        if (value.length <= 10) {
            const formatted = value.length > 5
                ? `+91 ${value.slice(0, 5)} ${value.slice(5)}`
                : value.length > 0
                    ? `+91 ${value}`
                    : '';
            setFormData(prev => ({ ...prev, phone: formatted }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        const result = await signup(formData.email, formData.password, {
            fullName: formData.fullName,
            phone: formData.phone,
            location: formData.location,
            role: formData.role
        });

        setLoading(false);

        if (result.success) {
            showToast('Account created successfully! Redirecting to login...', 'success');
            setTimeout(() => {
                navigate('/signin');
            }, 2000);
        } else {
            showToast(result.error || 'Failed to create account', 'error');
        }
    };

    const passwordStrength = getPasswordStrength();

    return (
        <div className="min-h-screen bg-transparent flex items-center justify-center p-4 relative overflow-hidden">
            {/* Pulsing Background Blobs */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-neon-blue/20 rounded-full blur-[100px] animate-pulse-fast"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[100px] animate-pulse-fast delay-700"></div>

            <div className="w-full max-w-md animate-slide-in relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple text-glow mb-2">Athanuramman Fencing</h1>
                    <p className="text-gray-400">Create your account</p>
                </div>

                <div className="glass-panel p-8 rounded-2xl border border-neon-blue/20 shadow-neon animate-float-6s">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">
                                Full Name *
                            </label>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-neon-blue transition-colors w-5 h-5" />
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={`input pl-10 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-neon-blue focus:shadow-neon ${errors.fullName ? 'border-red-500/50 focus:border-red-500' : ''}`}
                                    placeholder="Enter your full name"
                                />
                            </div>
                            {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">
                                Email Address *
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-neon-blue transition-colors w-5 h-5" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`input pl-10 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-neon-blue focus:shadow-neon ${errors.email ? 'border-red-500/50 focus:border-red-500' : ''}`}
                                    placeholder="Enter your email"
                                />
                            </div>
                            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">
                                Phone Number *
                            </label>
                            <div className="relative group">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-neon-blue transition-colors w-5 h-5" />
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                    className={`input pl-10 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-neon-blue focus:shadow-neon ${errors.phone ? 'border-red-500/50 focus:border-red-500' : ''}`}
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>
                            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">
                                Location *
                            </label>
                            <div className="relative group">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-neon-blue transition-colors w-5 h-5" />
                                <input
                                    type="text"
                                    list="location-options"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="input pl-10 bg-white/5 border-white/10 text-white focus:border-neon-blue focus:shadow-neon"
                                    placeholder="Select or type your location"
                                />
                                <datalist id="location-options">
                                    {locations.map(loc => (
                                        <option key={loc} value={loc} />
                                    ))}
                                </datalist>
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">
                                Account Type *
                            </label>
                            <div className="relative group">
                                <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-neon-blue transition-colors w-5 h-5" />
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="input pl-10 bg-white/5 border-white/10 text-white focus:border-neon-blue focus:shadow-neon appearance-none"
                                >
                                    <option value="Customer" className="bg-gray-900 text-white">Customer</option>
                                    <option value="Admin" className="bg-gray-900 text-white">Admin</option>
                                </select>
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">
                                Password *
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-neon-purple transition-colors w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`input pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-neon-purple focus:shadow-neon-purple ${errors.password ? 'border-red-500/50 focus:border-red-500' : ''}`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}

                            {/* Password Strength */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${passwordStrength.color} transition-all duration-300 shadow-[0_0_10px_currentColor]`}
                                                style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-400">{passwordStrength.label}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">
                                Confirm Password *
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-neon-purple transition-colors w-5 h-5" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`input pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-neon-purple focus:shadow-neon-purple ${errors.confirmPassword ? 'border-red-500/50 focus:border-red-500' : ''}`}
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>

                        {/* Terms & Conditions Checkbox */}
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    checked={formData.terms}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded bg-white/10 border-white/20 text-neon-blue focus:ring-neon-blue focus:ring-offset-0 focus:ring-offset-transparent"
                                />
                            </div>
                            <div className="ml-2 text-sm">
                                <label htmlFor="terms" className="font-medium text-gray-300">
                                    I agree to the <a href="#" className="text-neon-blue hover:underline">Terms and Conditions</a>
                                </label>
                                {errors.terms && <p className="text-red-400 text-xs mt-1">{errors.terms}</p>}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn btn-primary py-3 text-lg font-bold flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 translate-x-[-100%] group-hover:translate-x-100 transition-transform duration-700"></div>
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span className="text-glow">Creating Account...</span>
                                </>
                            ) : (
                                <span className="text-glow">Sign Up</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            Already have an account?{' '}
                            <Link to="/signin" className="text-neon-blue hover:text-neon-purple font-medium transition-colors hover:underline decoration-neon-purple/30">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
