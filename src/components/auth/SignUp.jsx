import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, UserCircle, Sparkles, ArrowRight, Shield } from 'lucide-react';
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
    const [focusedField, setFocusedField] = useState(null);

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
        if (!password) return { strength: 0, label: '', color: '', gradientColor: '' };

        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;

        const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
        const gradients = [
            '',
            'bg-gradient-to-r from-red-500 to-red-600',
            'bg-gradient-to-r from-orange-500 to-yellow-500',
            'bg-gradient-to-r from-yellow-500 to-green-500',
            'bg-gradient-to-r from-green-500 to-emerald-500'
        ];

        return {
            strength,
            label: labels[Math.min(strength, 4)],
            gradientColor: gradients[Math.min(strength, 4)]
        };
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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
        <div className="min-h-screen bg-transparent flex items-center justify-center p-4 py-8 relative overflow-hidden">
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

            <div className="w-full max-w-lg animate-slide-in relative z-10">
                {/* Header Section */}
                <div className="text-center mb-8 flex flex-col items-center">
                    <div className="relative mb-5 group">
                        <Shield className="w-16 h-16 text-neon-blue animate-pulse-fast" />
                        <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-neon-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                    </div>

                    <h1 className="text-5xl font-bold mb-3 relative">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-purple-400 to-neon-purple animate-glow">
                            Athanuramman Fencing
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg font-light tracking-wide">Create your account to get started</p>
                </div>

                {/* Main Card with 3D Effect */}
                <div className="relative group">
                    {/* 3D Shadow Layers */}
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 rounded-3xl blur-xl transform translate-y-2 translate-x-2 opacity-50"></div>
                    <div className="absolute inset-0 bg-gradient-to-tl from-purple-500/5 to-cyan-500/5 rounded-3xl blur-lg transform -translate-y-1 -translate-x-1 opacity-30"></div>

                    {/* Main Glass Panel */}
                    <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,243,255,0.2)] p-8 hover:shadow-[0_8px_48px_0_rgba(189,0,255,0.3)] transition-all duration-500 animate-float-6s">
                        {/* Top Accent Line */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-neon-purple to-transparent rounded-full"></div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Full Name with Floating Label */}
                            <div className="relative">
                                <div className="relative group/input">
                                    <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${focusedField === 'fullName' ? 'text-neon-blue scale-110' : 'text-gray-500'
                                        }`} />
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('fullName')}
                                        onBlur={() => setFocusedField(null)}
                                        className={`w-full pl-12 pr-4 py-3.5 bg-white/5 border-2 rounded-xl text-white placeholder-transparent focus:bg-white/10 transition-all duration-300 peer ${errors.fullName ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-white/10 focus:border-neon-blue focus:shadow-[0_0_20px_rgba(0,243,255,0.3)]'
                                            }`}
                                        placeholder="Full Name"
                                        required
                                    />
                                    <label className={`absolute left-12 transition-all duration-300 pointer-events-none ${formData.fullName || focusedField === 'fullName'
                                            ? '-top-3 left-3 text-xs bg-gradient-to-r from-neon-blue to-cyan-400 bg-clip-text text-transparent font-semibold px-2'
                                            : 'top-1/2 -translate-y-1/2 text-gray-400'
                                        }`}>
                                        Full Name *
                                    </label>
                                </div>
                                {errors.fullName && <p className="text-red-400 text-xs mt-1.5 ml-1 font-medium">{errors.fullName}</p>}
                            </div>

                            {/* Email with Floating Label */}
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
                                        className={`w-full pl-12 pr-4 py-3.5 bg-white/5 border-2 rounded-xl text-white placeholder-transparent focus:bg-white/10 transition-all duration-300 peer ${errors.email ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-white/10 focus:border-neon-blue focus:shadow-[0_0_20px_rgba(0,243,255,0.3)]'
                                            }`}
                                        placeholder="Email Address"
                                        required
                                    />
                                    <label className={`absolute left-12 transition-all duration-300 pointer-events-none ${formData.email || focusedField === 'email'
                                            ? '-top-3 left-3 text-xs bg-gradient-to-r from-neon-blue to-cyan-400 bg-clip-text text-transparent font-semibold px-2'
                                            : 'top-1/2 -translate-y-1/2 text-gray-400'
                                        }`}>
                                        Email Address *
                                    </label>
                                </div>
                                {errors.email && <p className="text-red-400 text-xs mt-1.5 ml-1 font-medium">{errors.email}</p>}
                            </div>

                            {/* Phone with Floating Label */}
                            <div className="relative">
                                <div className="relative group/input">
                                    <Phone className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${focusedField === 'phone' ? 'text-neon-blue scale-110' : 'text-gray-500'
                                        }`} />
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handlePhoneChange}
                                        onFocus={() => setFocusedField('phone')}
                                        onBlur={() => setFocusedField(null)}
                                        className={`w-full pl-12 pr-4 py-3.5 bg-white/5 border-2 rounded-xl text-white placeholder-transparent focus:bg-white/10 transition-all duration-300 peer ${errors.phone ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-white/10 focus:border-neon-blue focus:shadow-[0_0_20px_rgba(0,243,255,0.3)]'
                                            }`}
                                        placeholder="Phone Number"
                                        required
                                    />
                                    <label className={`absolute left-12 transition-all duration-300 pointer-events-none ${formData.phone || focusedField === 'phone'
                                            ? '-top-3 left-3 text-xs bg-gradient-to-r from-neon-blue to-cyan-400 bg-clip-text text-transparent font-semibold px-2'
                                            : 'top-1/2 -translate-y-1/2 text-gray-400'
                                        }`}>
                                        Phone Number *
                                    </label>
                                </div>
                                {errors.phone && <p className="text-red-400 text-xs mt-1.5 ml-1 font-medium">{errors.phone}</p>}
                            </div>

                            {/* Two Column Layout for Location and Role */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Location */}
                                <div className="relative">
                                    <div className="relative group/input">
                                        <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-all duration-300 ${focusedField === 'location' ? 'text-neon-blue scale-110' : 'text-gray-500'
                                            }`} />
                                        <input
                                            type="text"
                                            list="location-options"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('location')}
                                            onBlur={() => setFocusedField(null)}
                                            className="w-full pl-10 pr-3 py-3.5 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-transparent focus:border-neon-blue focus:bg-white/10 transition-all duration-300 focus:shadow-[0_0_20px_rgba(0,243,255,0.3)] peer text-sm"
                                            placeholder="Location"
                                        />
                                        <label className={`absolute left-10 transition-all duration-300 pointer-events-none ${formData.location || focusedField === 'location'
                                                ? '-top-2.5 left-2 text-xs bg-gradient-to-r from-neon-blue to-cyan-400 bg-clip-text text-transparent font-semibold px-1.5'
                                                : 'top-1/2 -translate-y-1/2 text-gray-400 text-sm'
                                            }`}>
                                            Location *
                                        </label>
                                        <datalist id="location-options">
                                            {locations.map(loc => (
                                                <option key={loc} value={loc} />
                                            ))}
                                        </datalist>
                                    </div>
                                </div>

                                {/* Role */}
                                <div className="relative">
                                    <div className="relative group/input">
                                        <UserCircle className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-all duration-300 ${focusedField === 'role' ? 'text-neon-blue scale-110' : 'text-gray-500'
                                            }`} />
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('role')}
                                            onBlur={() => setFocusedField(null)}
                                            className="w-full pl-10 pr-3 py-3.5 bg-white/5 border-2 border-white/10 rounded-xl text-white focus:border-neon-blue focus:bg-white/10 transition-all duration-300 focus:shadow-[0_0_20px_rgba(0,243,255,0.3)] appearance-none text-sm cursor-pointer"
                                        >
                                            <option value="Customer" className="bg-gray-900 text-white">Customer</option>
                                            <option value="Admin" className="bg-gray-900 text-white">Admin</option>
                                        </select>
                                        <label className="absolute -top-2.5 left-2 text-xs bg-gradient-to-r from-neon-blue to-cyan-400 bg-clip-text text-transparent font-semibold px-1.5">
                                            Account Type *
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Password with Floating Label */}
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
                                        className={`w-full pl-12 pr-12 py-3.5 bg-white/5 border-2 rounded-xl text-white placeholder-transparent focus:bg-white/10 transition-all duration-300 peer ${errors.password ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-white/10 focus:border-neon-purple focus:shadow-[0_0_20px_rgba(189,0,255,0.3)]'
                                            }`}
                                        placeholder="Password"
                                        required
                                    />
                                    <label className={`absolute left-12 transition-all duration-300 pointer-events-none ${formData.password || focusedField === 'password'
                                            ? '-top-3 left-3 text-xs bg-gradient-to-r from-neon-purple to-pink-400 bg-clip-text text-transparent font-semibold px-2'
                                            : 'top-1/2 -translate-y-1/2 text-gray-400'
                                        }`}>
                                        Password *
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-400 text-xs mt-1.5 ml-1 font-medium">{errors.password}</p>}

                                {/* Enhanced Password Strength Indicator */}
                                {formData.password && (
                                    <div className="mt-3 space-y-1.5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                                                <div
                                                    className={`h-full ${passwordStrength.gradientColor} transition-all duration-500 shadow-[0_0_15px_currentColor]`}
                                                    style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-semibold text-gray-300 min-w-[50px]">{passwordStrength.label}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password with Floating Label */}
                            <div className="relative">
                                <div className="relative group/input">
                                    <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${focusedField === 'confirmPassword' ? 'text-neon-purple scale-110' : 'text-gray-500'
                                        }`} />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('confirmPassword')}
                                        onBlur={() => setFocusedField(null)}
                                        className={`w-full pl-12 pr-12 py-3.5 bg-white/5 border-2 rounded-xl text-white placeholder-transparent focus:bg-white/10 transition-all duration-300 peer ${errors.confirmPassword ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-white/10 focus:border-neon-purple focus:shadow-[0_0_20px_rgba(189,0,255,0.3)]'
                                            }`}
                                        placeholder="Confirm Password"
                                        required
                                    />
                                    <label className={`absolute left-12 transition-all duration-300 pointer-events-none ${formData.confirmPassword || focusedField === 'confirmPassword'
                                            ? '-top-3 left-3 text-xs bg-gradient-to-r from-neon-purple to-pink-400 bg-clip-text text-transparent font-semibold px-2'
                                            : 'top-1/2 -translate-y-1/2 text-gray-400'
                                        }`}>
                                        Confirm Password *
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 focus:outline-none"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1.5 ml-1 font-medium">{errors.confirmPassword}</p>}
                            </div>

                            {/* Terms & Conditions */}
                            <div className="flex items-start pt-2">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        checked={formData.terms}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded-md bg-white/10 border-2 border-white/20 text-neon-blue focus:ring-2 focus:ring-neon-blue focus:ring-offset-0 transition-all duration-300 cursor-pointer"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="font-medium text-gray-300 cursor-pointer">
                                        I agree to the <a href="#" className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent hover:from-neon-purple hover:to-neon-blue transition-all duration-300 font-semibold">Terms and Conditions</a>
                                    </label>
                                    {errors.terms && <p className="text-red-400 text-xs mt-1 font-medium">{errors.terms}</p>}
                                </div>
                            </div>

                            {/* Premium Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="relative w-full mt-6 py-4 rounded-xl font-bold text-lg overflow-hidden group/btn disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
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
                                            <span className="tracking-wide">Creating Account...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="tracking-wide">Create Account</span>
                                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>

                        {/* Sign In Link */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-400 text-sm">
                                Already have an account?{' '}
                                <Link
                                    to="/signin"
                                    className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent font-bold hover:from-neon-purple hover:to-neon-blue transition-all duration-300 relative group/signin"
                                >
                                    Sign In
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-neon-blue to-neon-purple scale-x-0 group-hover/signin:scale-x-100 transition-transform duration-300"></span>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
