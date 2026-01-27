import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Package, FileText, FolderKanban, Users, IndianRupee, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import GlassCard from '../common/GlassCard';
import PremiumButton from '../common/PremiumButton';
import AnimatedBackground from '../common/AnimatedBackground';
import { useToast } from '../common/Toast';

const Dashboard = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalQuotes: 0,
        activeProjects: 0,
        totalCustomers: 0,
        revenueThisMonth: 0
    });
    const [recentQuotes, setRecentQuotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribers = [];

        const setupListeners = () => {
            // Stats & Recent Quotes Real-time Listeners
            const collections = ['products', 'quotes', 'projects', 'users'];

            setLoading(true);

            // 1. Products Listener
            unsubscribers.push(onSnapshot(collection(db, 'products'), (snap) => {
                setStats(prev => ({ ...prev, totalProducts: snap.size }));
            }));

            // 2. Quotes & Revenue Listener
            unsubscribers.push(onSnapshot(collection(db, 'quotes'), (snap) => {
                const quotes = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();

                const revenue = quotes
                    .filter(q => {
                        const quoteDate = q.createdAt ? new Date(q.createdAt) : new Date();
                        const isThisMonth = quoteDate.getMonth() === currentMonth && quoteDate.getFullYear() === currentYear;
                        // Operational status for revenue is 'Approved' in this workflow
                        return isThisMonth && q.status === 'Approved';
                    })
                    .reduce((sum, q) => sum + (Number(q.totalCost) || Number(q.estimatedCost) || 0), 0);

                const sortedQuotes = [...quotes]
                    .sort((a, b) => {
                        const dateA = a.createdAt ? new Date(a.createdAt) : 0;
                        const dateB = b.createdAt ? new Date(b.createdAt) : 0;
                        return dateB - dateA;
                    })
                    .slice(0, 5);

                setStats(prev => ({
                    ...prev,
                    totalQuotes: snap.size,
                    revenueThisMonth: revenue
                }));
                setRecentQuotes(sortedQuotes);
                setLoading(false);
            }, (error) => {
                console.error('Quotes listener error:', error);
                setLoading(false);
            }));

            // 3. Projects Listener
            unsubscribers.push(onSnapshot(collection(db, 'projects'), (snap) => {
                const activeCount = snap.docs.filter(doc => doc.data().status === 'In Progress').length;
                setStats(prev => ({ ...prev, activeProjects: activeCount }));
            }));

            // 4. Customers Listener
            unsubscribers.push(onSnapshot(collection(db, 'users'), (snap) => {
                const customerCount = snap.docs.filter(doc => doc.data().role === 'Customer').length;
                setStats(prev => ({ ...prev, totalCustomers: customerCount }));
            }));
        };

        setupListeners();

        return () => unsubscribers.forEach(unsub => unsub());
    }, []);

    if (loading) {
        return <LoadingSpinner text="Loading dashboard..." />;
    }

    const statCards = [
        {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: Package,
            gradient: 'from-blue-600 to-cyan-500',
            change: '+12%',
            path: '/admin/products'
        },
        {
            title: 'Total Quotes',
            value: stats.totalQuotes,
            icon: FileText,
            gradient: 'from-purple-600 to-pink-500',
            change: '+8%',
            path: '/admin/quotes'
        },
        {
            title: 'Active Projects',
            value: stats.activeProjects,
            icon: FolderKanban,
            gradient: 'from-emerald-600 to-teal-500',
            change: '+15%',
            path: '/admin/projects'
        },
        {
            title: 'Total Customers',
            value: stats.totalCustomers,
            icon: Users,
            gradient: 'from-amber-500 to-orange-500',
            change: '+20%',
            path: '/admin/customers'
        },
    ];

    return (
        <div className="space-y-8 relative">
            {/* Animated Background */}
            <AnimatedBackground />

            {/* Hero Header */}
            <div className="relative">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-slate-950 mb-2 flex items-center gap-3">
                            <Sparkles className="w-10 h-10 text-premium-cyan animate-float" />
                            <span className="gradient-text">Welcome Back!</span>
                        </h1>
                        <p className="text-lg text-slate-600">Here's what's happening with your business today</p>
                    </div>
                    <PremiumButton
                        variant="primary"
                        icon={TrendingUp}
                        onClick={() => navigate('/admin/reports')}
                    >
                        View Reports
                    </PremiumButton>
                </div>
            </div>

            {/* Revenue Highlight Card */}
            <GlassCard className="bg-gradient-primary p-8 text-white animate-fade-in-up" hover={false}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-2">Revenue This Month</p>
                        <h2 className="text-5xl font-black mb-2">₹{stats.revenueThisMonth.toLocaleString()}</h2>
                        <div className="flex items-center gap-2 text-white/90">
                            <TrendingUp className="w-5 h-5" />
                            <span className="text-lg font-semibold">+18.5% from last month</span>
                        </div>
                    </div>
                    <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center animate-float">
                        <IndianRupee className="w-16 h-16 text-white" />
                    </div>
                </div>
            </GlassCard>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <GlassCard
                            key={index}
                            className="animate-fade-in-up cursor-pointer group"
                            style={{ animationDelay: `${index * 100}ms` }}
                            onClick={() => navigate(card.path)}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-14 h-14 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center shadow-glow animate-float`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                    {card.change}
                                </span>
                            </div>
                            <h3 className="text-3xl font-black text-slate-950 mb-2">{card.value}</h3>
                            <p className="text-sm text-slate-600 font-medium">{card.title}</p>
                            <div className="mt-4 h-1 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-gradient-to-r ${card.gradient}`}
                                    style={{ width: '75%' }}
                                ></div>
                            </div>
                        </GlassCard>
                    );
                })}
            </div>

            {/* Recent Quotes */}
            <GlassCard className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-950">Recent Quotes</h2>
                    <button
                        onClick={() => navigate('/admin/quotes')}
                        className="text-brand-700 hover:text-brand-900 font-semibold flex items-center gap-2 transition-colors"
                    >
                        View All
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {recentQuotes.length > 0 ? (
                                recentQuotes.map((quote) => (
                                    <tr
                                        key={quote.id}
                                        className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                                        onClick={() => navigate('/admin/quotes')}
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-slate-950">{quote.customerName || quote.clientName || 'Unknown'}</p>
                                            <p className="text-xs text-slate-500">{quote.clientEmail}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900">{quote.productName || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-lg font-bold gradient-text">
                                                ₹{(quote.totalCost || quote.estimatedCost || 0).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`badge ${quote.status === 'Approved' ? 'badge-success' :
                                                quote.status === 'Pending' ? 'badge-warning' :
                                                    'badge-error'
                                                }`}>
                                                {quote.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        No recent quotes
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                <GlassCard className="group cursor-pointer" onClick={() => navigate('/admin/products')}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-950">Manage Products</h3>
                            <p className="text-sm text-slate-600">Add or edit products</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="group cursor-pointer" onClick={() => navigate('/admin/quotes')}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-950">Review Quotes</h3>
                            <p className="text-sm text-slate-600">Approve or reject quotes</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="group cursor-pointer" onClick={() => navigate('/admin/customers')}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-950">View Customers</h3>
                            <p className="text-sm text-slate-600">Manage customer accounts</p>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default Dashboard;
