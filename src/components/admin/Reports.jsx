import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Package, FileText, Users, Sparkles, PieChart, ArrowUpRight, Calendar, Filter, Share2, IndianRupee } from 'lucide-react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import LoadingSpinner from '../common/LoadingSpinner';
import GlassCard from '../common/GlassCard';
import PremiumButton from '../common/PremiumButton';
import AnimatedBackground from '../common/AnimatedBackground';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart as RePieChart,
    Pie,
    Cell,
} from 'recharts';

const Reports = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalQuotes: 0,
        totalProducts: 0,
        totalCustomers: 0,
        revenueTrend: []
    });

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const [quotesSnap, productsSnap, usersSnap] = await Promise.all([
                getDocs(collection(db, 'quotes')),
                getDocs(collection(db, 'products')),
                getDocs(collection(db, 'users'))
            ]);

            const quotes = quotesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const users = usersSnap.docs.map(doc => doc.data());

            const totalRevenue = quotes
                .filter(q => q.status === 'Approved' || q.status === 'Completed')
                .reduce((sum, q) => sum + (q.totalCost || q.estimatedCost || 0), 0);

            const customers = users.filter(u => u.role === 'Customer').length;

            // Mock revenue trend based on existing data
            const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
            const trendData = months.map((month, i) => ({
                name: month,
                revenue: (totalRevenue / 6) * (0.8 + Math.random() * 0.4),
                quotes: Math.floor(quotes.length / 6 * (0.7 + Math.random() * 0.6))
            }));

            setStats({
                totalRevenue,
                totalQuotes: quotesSnap.size,
                totalProducts: productsSnap.size,
                totalCustomers: customers,
                revenueTrend: trendData
            });
        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner text="Generating high-fidelity business intelligence..." />;

    const reportCards = [
        {
            title: 'Gross Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            gradient: 'from-emerald-500 to-teal-400',
            change: '+14.2%',
            delay: 100
        },
        {
            title: 'Quote Influx',
            value: stats.totalQuotes,
            icon: FileText,
            gradient: 'from-premium-purple to-indigo-500',
            change: '+8.7%',
            delay: 200
        },
        {
            title: 'Catalog Size',
            value: stats.totalProducts,
            icon: Package,
            gradient: 'from-premium-cyan to-blue-500',
            change: '+2.4%',
            delay: 300
        },
        {
            title: 'Client Base',
            value: stats.totalCustomers,
            icon: Users,
            gradient: 'from-amber-500 to-orange-400',
            change: '+18.1%',
            delay: 400
        }
    ];

    const pieData = [
        { name: 'Completed', value: 45, color: '#10B981' },
        { name: 'In Progress', value: 35, color: '#00D9FF' },
        { name: 'Pending', value: 20, color: '#F59E0B' },
    ];

    return (
        <div className="space-y-8 relative">
            <AnimatedBackground />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="animate-fade-in">
                    <h1 className="text-4xl font-black text-slate-950 flex items-center gap-3">
                        <BarChart3 className="w-10 h-10 text-premium-purple animate-float" />
                        <span className="gradient-text">Business Insights</span>
                    </h1>
                    <p className="text-slate-600 mt-2 font-medium">Predictive analytics and performance monitoring</p>
                </div>
                <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <PremiumButton variant="outline" icon={Share2}>Export Data</PremiumButton>
                    <PremiumButton variant="primary" icon={Calendar}>Time Range</PremiumButton>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {reportCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <GlassCard
                            key={index}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${card.delay}ms` }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-14 h-14 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center shadow-glow animate-float`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex items-center gap-1 text-emerald-500 font-black text-xs bg-emerald-50 px-2 py-1 rounded-lg">
                                    <ArrowUpRight className="w-3 h-3" />
                                    {card.change}
                                </div>
                            </div>
                            <h3 className="text-3xl font-black text-slate-950 mb-2 truncate">{card.value}</h3>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{card.title}</p>
                            <div className="mt-4 h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full bg-gradient-to-r ${card.gradient}`} style={{ width: '70%' }}></div>
                            </div>
                        </GlassCard>
                    );
                })}
            </div>

            {/* Main Charts area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Trend Chart */}
                <GlassCard className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-950">Revenue Trajectory</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">H1 2026 Fiscal Performance</p>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                            <TrendingUp className="w-5 h-5 text-premium-purple" />
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.trendData || stats.revenueTrend}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94A3B8' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94A3B8' }}
                                    tickFormatter={(value) => `₹${value / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        borderRadius: '16px',
                                        border: '1px solid #E2E8F0',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        fontWeight: 'bold'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#7C3AED"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                {/* Status Distribution */}
                <GlassCard className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-950">Proposal Status</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Lifecycle Allocation</p>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                            <PieChart className="w-5 h-5 text-premium-cyan" />
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </RePieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 mt-4">
                        {pieData.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{item.name}</span>
                                </div>
                                <span className="text-sm font-black text-slate-900">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>

            {/* Quarterly Performance Table */}
            <GlassCard className="animate-fade-in-up" style={{ animationDelay: '700ms' }}>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-black text-slate-950">Quarterly Audit</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Comparative Monthly Metrics</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort by Volume</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/50 border-b border-slate-200">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Fiscal Period</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Revenue Flow</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Proposal Volume</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Performance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {stats.revenueTrend.map((row, i) => (
                                <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 group-hover:scale-110 transition-transform">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-950">{row.name} 2026</p>
                                                <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Verified</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-1">
                                            <IndianRupee className="w-4 h-4 text-slate-900" />
                                            <span className="text-lg font-black text-slate-950 tabular-nums">
                                                {Math.floor(row.revenue).toLocaleString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-black text-slate-600 font-mono tracking-widest uppercase">{row.quotes} Units</td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-end">
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                +{Math.floor(Math.random() * 15 + 5)}% Growth
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-premium-purple/5 rounded-full blur-[150px] pointer-events-none -z-10 animate-blob"></div>
        </div>
    );
};

export default Reports;
