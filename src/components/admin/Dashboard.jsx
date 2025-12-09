import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Package, FileText, FolderKanban, Users, IndianRupee, TrendingUp, Activity, Star, Zap, BarChart3, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
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
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [productsSnap, quotesSnap, projectsSnap, usersSnap] = await Promise.all([
                getDocs(collection(db, 'products')),
                getDocs(collection(db, 'quotes')),
                getDocs(collection(db, 'projects')),
                getDocs(collection(db, 'users'))
            ]);

            const projects = projectsSnap.docs.map(doc => doc.data());
            const quotes = quotesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const users = usersSnap.docs.map(doc => doc.data());

            const activeProjects = projects.filter(p => p.status === 'In Progress').length;
            const customers = users.filter(u => u.role === 'Customer').length;

            // Calculate revenue from completed projects this month
            const currentMonth = new Date().getMonth();
            const revenue = quotes
                .filter(q => {
                    const quoteDate = new Date(q.createdAt);
                    return quoteDate.getMonth() === currentMonth && q.status === 'Completed';
                })
                .reduce((sum, q) => sum + (q.totalCost || 0), 0);

            // Sort quotes by date for Recent Activity
            const sortedQuotes = quotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

            setStats({
                totalProducts: productsSnap.size,
                totalQuotes: quotesSnap.size,
                activeProjects,
                totalCustomers: customers,
                revenueThisMonth: revenue
            });
            setRecentQuotes(sortedQuotes);

        } catch (error) {
            console.error('Error fetching stats:', error);
            showToast('Failed to fetch dashboard data', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner text="Initializing Control Deck..." />;
    }

    const statCards = [
        {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: Package,
            color: 'text-neon-blue',
            glow: 'shadow-[0_0_15px_rgba(0,243,255,0.4)]',
            bgGradient: 'from-neon-blue/10 to-transparent',
            path: '/admin/products',
            delay: 'delay-0'
        },
        {
            title: 'Total Quotes',
            value: stats.totalQuotes,
            icon: FileText,
            color: 'text-emerald-400',
            glow: 'shadow-[0_0_15px_rgba(52,211,153,0.4)]',
            bgGradient: 'from-emerald-500/10 to-transparent',
            path: '/admin/quotes',
            delay: 'delay-75'
        },
        {
            title: 'Active Projects',
            value: stats.activeProjects,
            icon: FolderKanban,
            color: 'text-neon-purple',
            glow: 'shadow-[0_0_15px_rgba(189,0,255,0.4)]',
            bgGradient: 'from-neon-purple/10 to-transparent',
            path: '/admin/projects',
            delay: 'delay-100'
        },
        {
            title: 'Total Customers',
            value: stats.totalCustomers,
            icon: Users,
            color: 'text-pink-500',
            glow: 'shadow-[0_0_15px_rgba(236,72,153,0.4)]',
            bgGradient: 'from-pink-500/10 to-transparent',
            path: '/admin/customers',
            delay: 'delay-150'
        },
        {
            title: 'Revenue (Month)',
            value: `₹${stats.revenueThisMonth.toLocaleString()}`,
            icon: IndianRupee,
            color: 'text-yellow-400',
            glow: 'shadow-[0_0_15px_rgba(250,204,21,0.4)]',
            bgGradient: 'from-yellow-500/10 to-transparent',
            path: '/admin/reports',
            delay: 'delay-200'
        }
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Approved': return 'text-green-400 bg-green-500/10 border-green-500/20';
            case 'Pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'Completed': return 'text-neon-blue bg-neon-blue/10 border-neon-blue/20';
            case 'Rejected': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            onClick={() => navigate(stat.path)}
                            className={`glass-panel p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-white/5 hover:border-white/20 hover:shadow-lg ${stat.delay} animate-slide-in`}
                        >
                            {/* Background Glow */}
                            <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${stat.bgGradient} rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${stat.glow} group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <Zap className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                                </div>

                                <div>
                                    <p className="text-gray-400 text-sm font-medium mb-1 tracking-wide">{stat.title}</p>
                                    <h3 className="text-2xl font-bold text-white group-hover:text-glow transition-all">{stat.value}</h3>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity Table */}
                <div className="lg:col-span-2 glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-neon">
                    <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Activity className="w-5 h-5 text-neon-blue" />
                            <h3 className="text-lg font-bold text-white">Recent Admin Activity</h3>
                        </div>
                        <button
                            onClick={() => navigate('/admin/quotes')}
                            className="text-sm text-neon-blue hover:text-white transition-colors hover:underline"
                        >
                            View All
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {recentQuotes.length > 0 ? (
                                    recentQuotes.map((quote) => (
                                        <tr key={quote.id} className="group hover:bg-white/5 transition-colors duration-200">
                                            <td className="px-6 py-4 text-gray-400 text-sm">
                                                {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white font-medium group-hover:text-neon-blue transition-colors">
                                                    {quote.customerName || quote.customer || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-green-400 text-sm">
                                                ₹{(quote.totalCost || 0).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(quote.status)}`}>
                                                    {quote.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                            No recent activity.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions - Vertical Spec */}
                <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden h-full">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-blue opacity-50"></div>

                    <div className="flex items-center gap-3 mb-6">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <h3 className="text-lg font-bold text-white">Quick Actions</h3>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => navigate('/admin/products')}
                            className="group relative overflow-hidden rounded-xl p-[1px] focus:outline-none w-full"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple opacity-50 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                            <div className="relative bg-space-black rounded-xl p-4 flex items-center gap-4 group-hover:bg-space-black/80 transition-colors">
                                <div className="p-2 rounded-lg bg-neon-blue/10 text-neon-blue group-hover:scale-110 transition-transform">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-white group-hover:text-neon-blue transition-colors">Add Product</h4>
                                    <p className="text-xs text-gray-400">Update inventory items</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/admin/quotes')}
                            className="group relative overflow-hidden rounded-xl p-[1px] focus:outline-none w-full"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-pink-600 opacity-50 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                            <div className="relative bg-space-black rounded-xl p-4 flex items-center gap-4 group-hover:bg-space-black/80 transition-colors">
                                <div className="p-2 rounded-lg bg-neon-purple/10 text-neon-purple group-hover:scale-110 transition-transform">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-white group-hover:text-neon-purple transition-colors">Create Quote</h4>
                                    <p className="text-xs text-gray-400">Draft new proposal</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/admin/reports')}
                            className="group relative overflow-hidden rounded-xl p-[1px] focus:outline-none w-full"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                            <div className="relative bg-space-black rounded-xl p-4 flex items-center gap-4 group-hover:bg-space-black/80 transition-colors">
                                <div className="p-2 rounded-lg bg-orange-400/10 text-orange-400 group-hover:scale-110 transition-transform">
                                    <BarChart3 className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-white group-hover:text-orange-400 transition-colors">View Reports</h4>
                                    <p className="text-xs text-gray-400">Check business health</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
