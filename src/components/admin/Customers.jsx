import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, MapPin, Calendar, Phone, Sparkles, UserCheck, Shield, ExternalLink } from 'lucide-react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useToast } from '../common/Toast';
import LoadingSpinner from '../common/LoadingSpinner';
import GlassCard from '../common/GlassCard';
import AnimatedBackground from '../common/AnimatedBackground';
import PremiumButton from '../common/PremiumButton';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, 'users'), where('role', '==', 'Customer'));
        const unsubscribe = onSnapshot(q, (snap) => {
            const customersData = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCustomers(customersData.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt) : 0;
                const dateB = b.createdAt ? new Date(b.createdAt) : 0;
                return dateB - dateA;
            }));
            setLoading(false);
        }, (error) => {
            console.error("Error fetching customers:", error);
            showToast('Failed to fetch customers', 'error');
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredCustomers = customers.filter(customer =>
        customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <LoadingSpinner text="Consulting our elite customer database..." />;

    return (
        <div className="space-y-8 relative">
            <AnimatedBackground />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="animate-fade-in">
                    <h1 className="text-4xl font-black text-slate-950 flex items-center gap-3">
                        <Users className="w-10 h-10 text-premium-purple animate-float" />
                        <span className="gradient-text">Elite Customers</span>
                    </h1>
                    <p className="text-slate-600 mt-2 font-medium">Manage and monitor your premium client base</p>
                </div>
                <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <div className="px-4 py-2 bg-white shadow-premium rounded-xl flex items-center gap-2 border border-slate-100">
                        <UserCheck className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm font-bold text-slate-700">{customers.length} Total</span>
                    </div>
                </div>
            </div>

            {/* Search & Statistics */}
            <GlassCard className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="relative flex-1 group w-full">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-premium-purple transition-colors" />
                        <input
                            type="text"
                            placeholder="Identify customer by name, email or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-premium-purple/10 focus:border-premium-purple transition-all font-medium"
                        />
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="flex-1 md:flex-none p-4 bg-gradient-to-br from-premium-purple to-indigo-600 rounded-2xl text-white shadow-glow animate-pulse-slow">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Sync Status</p>
                            <p className="text-sm font-bold flex items-center gap-2">
                                <Shield className="w-4 h-4" /> Live Secure
                            </p>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Customers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer, index) => (
                        <GlassCard
                            key={customer.id}
                            className="animate-fade-in-up group flex flex-col h-full"
                            style={{ animationDelay: `${300 + index * 50}ms` }}
                        >
                            <div className="flex items-start gap-5 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-tr from-premium-purple/10 to-premium-cyan/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                    <Users className="w-8 h-8 text-premium-purple group-hover:animate-float" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-black text-slate-950 text-xl truncate group-hover:text-premium-purple transition-colors">
                                            {customer.fullName || 'Anonymous Client'}
                                        </h3>
                                        <Sparkles className="w-4 h-4 text-premium-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter bg-slate-100 w-max px-2 py-0.5 rounded uppercase">
                                        V-ID: {customer.id.slice(0, 12)}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 flex-1">
                                <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-white hover:border-premium-purple/20 transition-all cursor-pointer">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <Mail className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700 truncate">{customer.email}</span>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {customer.phone && (
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/40 rounded-lg">
                                                <Phone className="w-4 h-4 text-slate-500" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-600">{customer.phone}</span>
                                        </div>
                                    )}
                                    {customer.location && (
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/40 rounded-lg">
                                                <MapPin className="w-4 h-4 text-slate-500" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-600 truncate">{customer.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider tabular-nums">
                                        Joined {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors group/btn">
                                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover/btn:text-premium-purple transition-colors" />
                                </button>
                            </div>
                        </GlassCard>
                    ))
                ) : (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3">
                        <GlassCard className="py-20 text-center animate-zoom-in">
                            <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12 group-hover:rotate-0 transition-transform">
                                <Users className="w-12 h-12 text-slate-400" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">No Profiles Found</h3>
                            <p className="text-slate-500 max-w-sm mx-auto font-medium">We couldn't find any clients matching your criteria. Try adjusting your verification parameters.</p>
                            <PremiumButton
                                variant="outline"
                                className="mt-8"
                                onClick={() => setSearchTerm('')}
                            >
                                Reset Filters
                            </PremiumButton>
                        </GlassCard>
                    </div>
                )}
            </div>

            {/* Background Decorative Blob for Content */}
            <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-premium-purple/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-blob"></div>
        </div>
    );
};

export default Customers;
