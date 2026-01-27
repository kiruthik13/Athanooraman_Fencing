import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, MapPin, Save, Calendar, Clock, Edit2, X, Sparkles, ShieldCheck, BadgeCheck, Globe, CreditCard } from 'lucide-react';
import { useToast } from '../common/Toast';
import LoadingSpinner from '../common/LoadingSpinner';
import GlassCard from '../common/GlassCard';
import AnimatedBackground from '../common/AnimatedBackground';
import PremiumButton from '../common/PremiumButton';

const Profile = () => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        fullName: '',
        email: '',
        phone: '',
        location: ''
    });

    useEffect(() => {
        fetchUserData();
    }, [currentUser]);

    const fetchUserData = async () => {
        try {
            if (currentUser) {
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUserData({
                        ...data,
                        fullName: data.fullName || '',
                        email: data.email || currentUser.email || '',
                        phone: data.phone || '',
                        location: data.location || ''
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateDoc(doc(db, 'users', currentUser.uid), {
                fullName: userData.fullName || '',
                phone: userData.phone || '',
                location: userData.location || '',
                updatedAt: new Date().toISOString()
            });
            showToast('Identity synchronized successfully', 'success');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            showToast('Identity synchronization failed', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <LoadingSpinner text="Authenticating identity parameters..." />;
    }

    return (
        <div className="space-y-12 relative pb-20">
            <AnimatedBackground />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                <div className="animate-fade-in">
                    <h1 className="text-4xl font-black text-slate-950 flex items-center gap-3">
                        <User className="w-10 h-10 text-premium-purple animate-float" />
                        <span className="gradient-text">Identity Hub</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-xs">Manage your architectural profile</p>
                </div>
                {!isEditing ? (
                    <PremiumButton
                        variant="primary"
                        icon={Edit2}
                        onClick={() => setIsEditing(true)}
                        className="animate-fade-in px-8 py-4 !shadow-glow"
                    >
                        Modify Identity
                    </PremiumButton>
                ) : (
                    <div className="flex gap-3 animate-fade-in">
                        <button
                            onClick={() => { setIsEditing(false); fetchUserData(); }}
                            className="px-8 py-4 bg-white/50 backdrop-blur-md border border-slate-200 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-500 hover:bg-white transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <PremiumButton
                            variant="primary"
                            icon={Save}
                            onClick={handleSave}
                            loading={saving}
                            className="px-8 py-4 !shadow-glow"
                        >
                            Sync Changes
                        </PremiumButton>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Identity Card */}
                <div className="lg:col-span-4 space-y-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <GlassCard className="text-center py-10">
                        <div className="relative w-32 h-32 mx-auto mb-8">
                            <div className="absolute inset-0 bg-gradient-to-tr from-premium-purple to-premium-cyan rounded-3xl rotate-12 blur-lg opacity-20 animate-pulse"></div>
                            <div className="relative w-full h-full bg-white rounded-3xl flex items-center justify-center border border-slate-100 shadow-premium overflow-hidden group">
                                <div className="absolute inset-0 bg-slate-950/5 group-hover:bg-slate-950/10 transition-colors" />
                                <User className="w-16 h-16 text-slate-200" />
                                <div className="absolute bottom-0 right-0 w-8 h-8 bg-premium-cyan rounded-tl-2xl flex items-center justify-center shadow-glow-sm">
                                    <BadgeCheck className="w-4 h-4 text-slate-950" />
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-black text-slate-950 mb-1">{userData.fullName || 'Architecture Client'}</h2>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">{userData.email}</p>

                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-glow">
                            <Sparkles className="w-3 h-3 text-premium-cyan" />
                            {userData.role || 'Elite Member'}
                        </div>

                        {/* Metadata Strip */}
                        <div className="mt-10 pt-10 border-t border-slate-100 space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 group hover:bg-white hover:shadow-card transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center border border-slate-100 group-hover:border-premium-purple transition-all">
                                        <Calendar className="w-4 h-4 text-premium-purple" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrolled</span>
                                </div>
                                <span className="text-sm font-black text-slate-950">
                                    {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Jan 2026'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 group hover:bg-white hover:shadow-card transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center border border-slate-100 group-hover:border-premium-cyan transition-all">
                                        <ShieldCheck className="w-4 h-4 text-premium-cyan" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trust Index</span>
                                </div>
                                <span className="text-sm font-black text-emerald-500 uppercase tracking-widest">Verified</span>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Security Quick Link */}
                    <GlassCard className="p-1 group cursor-pointer hover:border-premium-purple/30 transition-all">
                        <div className="p-6 bg-slate-50/50 rounded-[1.5rem] flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-premium-purple group-hover:text-white transition-all">
                                    <BadgeCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Two-Factor</p>
                                    <p className="text-xs font-black text-slate-900">Security Parameters</p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-premium-purple group-hover:bg-premium-purple/5 transition-all">
                                <Globe className="w-4 h-4 text-slate-300 group-hover:text-premium-purple" />
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Account Details Form */}
                <div className="lg:col-span-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <GlassCard className="h-full">
                        <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-8">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                                <BadgeCheck className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-950">Profile Core</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Managed account parameters</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Full Name */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Display Name</label>
                                <div className="relative group">
                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-premium-purple transition-colors" />
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={userData.fullName}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full bg-slate-50/50 border border-slate-200 rounded-3xl py-5 pl-14 pr-6 text-slate-950 focus:outline-none focus:ring-4 focus:ring-premium-purple/10 focus:border-premium-purple transition-all font-bold group-hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                                        placeholder="Full Name"
                                    />
                                </div>
                            </div>

                            {/* Email (Read-only) */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Verified Email Asset</label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        value={userData.email}
                                        disabled
                                        className="w-full bg-slate-100 border border-slate-200 rounded-3xl py-5 pl-14 pr-6 text-slate-500 font-bold cursor-not-allowed opacity-60"
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                        <BadgeCheck className="w-5 h-5 text-emerald-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Communication Network</label>
                                <div className="relative group">
                                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-premium-purple transition-colors" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={userData.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full bg-slate-50/50 border border-slate-200 rounded-3xl py-5 pl-14 pr-6 text-slate-950 focus:outline-none focus:ring-4 focus:ring-premium-purple/10 focus:border-premium-purple transition-all font-bold group-hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                                        placeholder="Phone Number"
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Geographic Domain</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-premium-purple transition-colors" />
                                    <input
                                        type="text"
                                        name="location"
                                        value={userData.location}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full bg-slate-50/50 border border-slate-200 rounded-3xl py-5 pl-14 pr-6 text-slate-950 focus:outline-none focus:ring-4 focus:ring-premium-purple/10 focus:border-premium-purple transition-all font-bold group-hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                                        placeholder="Primary Location"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* System Preference quick strip */}
                        <div className="mt-12 p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 flex flex-wrap items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                                    <CreditCard className="w-6 h-6 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Billing History</p>
                                    <p className="text-sm font-black text-slate-900 leading-none">Access Financial Records</p>
                                </div>
                            </div>
                            <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all">
                                Request Access
                            </button>
                        </div>
                    </GlassCard>
                </div>
            </div>

            <div className="absolute bottom-0 -right-20 w-80 h-80 bg-premium-purple/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-blob"></div>
        </div>
    );
};

export default Profile;
