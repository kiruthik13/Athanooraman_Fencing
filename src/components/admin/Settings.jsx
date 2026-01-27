import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Database, Save, Sparkles, Building2, Mail, Phone, MapPin, Globe, CreditCard } from 'lucide-react';
import { doc, onSnapshot, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useToast } from '../common/Toast';
import GlassCard from '../common/GlassCard';
import AnimatedBackground from '../common/AnimatedBackground';
import PremiumButton from '../common/PremiumButton';
import LoadingSpinner from '../common/LoadingSpinner';

const Settings = () => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Identity & Profile');
    const [settings, setSettings] = useState({
        companyName: 'Athanuramman Fencing',
        email: 'admin@athanurammanfencing.com',
        phone: '+91 1234567890',
        address: 'Coimbatore, Tamil Nadu',
        emailNotifications: true,
        smsNotifications: false,
        autoApproveQuotes: false,
        theme: 'Dark Lux',
        mfaEnabled: false,
        apiKey: 'sk_live_************************',
        lastBackup: new Date().toISOString()
    });

    useEffect(() => {
        const settingsRef = doc(db, 'settings', 'admin');
        const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
            if (docSnap.exists()) {
                setSettings(prev => ({ ...prev, ...docSnap.data() }));
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching settings:", error);
            showToast('Failed to load portal configuration', 'error');
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleChange = async (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));

        if (typeof value === 'boolean') {
            try {
                const settingsRef = doc(db, 'settings', 'admin');
                await setDoc(settingsRef, { [field]: value }, { merge: true });
            } catch (error) {
                console.error("Error updating toggle:", error);
                showToast('Failed to synchronize workflow option', 'error');
            }
        }
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        try {
            const settingsRef = doc(db, 'settings', 'admin');
            await setDoc(settingsRef, settings, { merge: true });
            showToast('Global configuration synchronized successfully', 'success');
        } catch (error) {
            console.error("Error saving settings:", error);
            showToast('Failed to synchronize global configuration', 'error');
        }
    };

    const Toggle = ({ checked, onChange, label, description }) => (
        <label className="flex items-center justify-between p-6 bg-white/50 backdrop-blur-md rounded-3xl border border-slate-100 cursor-pointer hover:bg-white hover:shadow-card transition-all group overflow-hidden relative">
            <div className="relative z-10 text-left">
                <p className="font-black text-slate-950 uppercase tracking-widest text-xs mb-1 group-hover:text-premium-purple transition-colors">{label}</p>
                <p className="text-sm text-slate-500 font-medium">{description}</p>
            </div>
            <div className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="sr-only peer"
                />
                <div className={`
                    w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer 
                    peer-checked:after:translate-x-full peer-checked:after:border-white 
                    after:content-[''] after:absolute after:top-[4px] after:left-[4px] 
                    after:bg-white after:border-gray-300 after:border after:rounded-full 
                    after:h-6 after:w-6 after:transition-all peer-checked:bg-premium-purple shadow-inner
                `}></div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-premium-purple/5 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </label>
    );

    if (loading) return <LoadingSpinner text="Synchronizing enterprise configuration..." />;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Identity & Profile':
                return (
                    <GlassCard className="animate-fade-in-up">
                        <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-6">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-950">Identity Settings</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Corporate profile visibility</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Entity Primary Name</label>
                                <div className="relative group text-left">
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-slate-950 focus:outline-none focus:ring-4 focus:ring-premium-purple/10 focus:border-premium-purple transition-all font-bold group-hover:bg-white"
                                        value={settings.companyName || ''}
                                        onChange={(e) => handleChange('companyName', e.target.value)}
                                    />
                                    <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-premium-purple/20 group-focus-within:text-premium-purple transition-colors" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Administrative Email</label>
                                <div className="relative group text-left">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-premium-purple transition-colors" />
                                    <input
                                        type="email"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 text-slate-950 focus:outline-none focus:ring-4 focus:ring-premium-purple/10 focus:border-premium-purple transition-all font-bold group-hover:bg-white"
                                        value={settings.email || ''}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Channel</label>
                                <div className="relative group text-left">
                                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-premium-purple transition-colors" />
                                    <input
                                        type="tel"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 text-slate-950 focus:outline-none focus:ring-4 focus:ring-premium-purple/10 focus:border-premium-purple transition-all font-bold group-hover:bg-white"
                                        value={settings.phone || ''}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Headquarters Address</label>
                                <div className="relative group text-left">
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-premium-purple transition-colors" />
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 text-slate-950 focus:outline-none focus:ring-4 focus:ring-premium-purple/10 focus:border-premium-purple transition-all font-bold group-hover:bg-white"
                                        value={settings.address || ''}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                );
            case 'Notification Hub':
                return (
                    <div className="space-y-8 animate-fade-in-up">
                        <GlassCard>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                                    <Bell className="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-950">Intelligent Workflows</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Automated control systems</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Toggle
                                    checked={settings.emailNotifications || false}
                                    onChange={(val) => handleChange('emailNotifications', val)}
                                    label="Premium Email Link"
                                    description="Receive high-tier architectural updates via mail"
                                />
                                <Toggle
                                    checked={settings.smsNotifications || false}
                                    onChange={(val) => handleChange('smsNotifications', val)}
                                    label="Urgent SMS Relay"
                                    description="Critical milestone alerts via mobile network"
                                />
                                <div className="md:col-span-2">
                                    <Toggle
                                        checked={settings.autoApproveQuotes || false}
                                        onChange={(val) => handleChange('autoApproveQuotes', val)}
                                        label="Algorithmic Approvals"
                                        description="Enable AI-driven validation for standard quote proposals under ₹10,000"
                                    />
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                );
            case 'Security & Access':
                return (
                    <div className="space-y-8 animate-fade-in-up">
                        <GlassCard>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-950">Access Parameters</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Secure session management</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <Toggle
                                    checked={settings.mfaEnabled || false}
                                    onChange={(val) => handleChange('mfaEnabled', val)}
                                    label="Multi-Factor Authentication"
                                    description="Add an extra layer of security to administrative logins"
                                />
                                <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Recent Access Logs</p>
                                    <div className="space-y-4">
                                        {[
                                            { action: 'Login Detected', location: 'Coimbatore, IN', time: '10 mins ago' },
                                            { action: 'Config Changed', location: 'Coimbatore, IN', time: '2 hours ago' }
                                        ].map((log, i) => (
                                            <div key={i} className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                    <span className="font-bold text-slate-700">{log.action}</span>
                                                </div>
                                                <span className="text-slate-400 font-medium">{log.location} • {log.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                );
            case 'Billing & Tiers':
                return (
                    <div className="space-y-8 animate-fade-in-up">
                        <GlassCard>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
                                    <CreditCard className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-950">Subscription Tier</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Enterprise financial metrics</p>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="px-4 py-1.5 bg-premium-cyan/20 text-premium-cyan rounded-full text-[10px] font-black uppercase tracking-widest border border-premium-cyan/30 shadow-glow-sm">
                                            Elite Enterprise
                                        </span>
                                        <Sparkles className="w-6 h-6 text-premium-cyan animate-pulse" />
                                    </div>
                                    <h4 className="text-3xl font-black mb-1">Architecture Pro</h4>
                                    <p className="text-slate-400 text-sm font-medium mb-8">Next billing cycle: Feb 26, 2026</p>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Monthly Investment</p>
                                            <p className="text-2xl font-black">₹49,999<span className="text-sm font-bold text-slate-500">/mo</span></p>
                                        </div>
                                        <button className="px-6 py-3 bg-white text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-glow transition-all">
                                            Manage Plan
                                        </button>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-premium-cyan/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                            </div>
                        </GlassCard>
                    </div>
                );
            case 'System Integration':
                return (
                    <div className="space-y-8 animate-fade-in-up">
                        <GlassCard>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                                    <Database className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-950">Infrastructure</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Neural network synchronization</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2 text-left">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Master API Key</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            readOnly
                                            value={settings.apiKey || ''}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-slate-950 focus:outline-none font-mono text-sm group-hover:bg-white transition-all"
                                        />
                                        <button className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-200 rounded-lg text-[10px] font-black uppercase hover:bg-slate-300 transition-colors">
                                            Roll Key
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl flex items-center justify-between">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900">Firestore Health Status</p>
                                            <p className="text-xs text-slate-500 font-medium tracking-tight">Latency: 24ms • All systems operational</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active</span>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-10 relative">
            <AnimatedBackground />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="animate-fade-in text-left">
                    <h1 className="text-4xl font-black text-slate-950 flex items-center gap-3">
                        <SettingsIcon className="w-10 h-10 text-premium-purple animate-spin-slow" />
                        <span className="gradient-text">Portal Configuration</span>
                    </h1>
                    <p className="text-slate-600 mt-2 font-medium text-left">Fine-tune your enterprise administrative environment</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <PremiumButton onClick={handleSave} icon={Save} className="shadow-glow px-8 py-4">
                        Synchronize Settings
                    </PremiumButton>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Navigation & Profile */}
                <div className="lg:col-span-4 space-y-8">
                    <GlassCard className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <div className="text-center py-6">
                            <div className="relative w-32 h-32 mx-auto mb-6">
                                <div className="absolute inset-0 bg-gradient-to-tr from-premium-purple to-premium-cyan rounded-3xl rotate-6 animate-pulse opacity-20"></div>
                                <div className="relative w-full h-full bg-white rounded-3xl flex items-center justify-center border border-slate-100 shadow-premium overflow-hidden">
                                    <Building2 className="w-16 h-16 text-slate-200" />
                                    <div className="absolute inset-0 bg-slate-950/5 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                                        <Sparkles className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </div>
                            <h2 className="text-2xl font-black text-slate-950 truncate px-4">{settings.companyName}</h2>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Enterprise Account</p>
                        </div>

                        <div className="space-y-2 mt-6">
                            {[
                                { icon: Building2, label: 'Identity & Profile' },
                                { icon: Bell, label: 'Notification Hub' },
                                { icon: Shield, label: 'Security & Access' },
                                { icon: CreditCard, label: 'Billing & Tiers' },
                                { icon: Database, label: 'System Integration' },
                            ].map((item, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setActiveTab(item.label)}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold ${activeTab === item.label
                                        ? 'bg-slate-950 text-white shadow-glow'
                                        : 'text-slate-500 hover:bg-slate-50'
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 ${activeTab === item.label ? 'text-premium-cyan' : 'text-slate-400'}`} />
                                    <span className="text-sm">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* Right Column: Content */}
                <div className="lg:col-span-8">
                    {renderTabContent()}
                </div>
            </div>

        </div>
    );
};

export default Settings;
