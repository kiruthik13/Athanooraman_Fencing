import React, { useState, useEffect } from 'react';
import { BarChart3, Download, TrendingUp, IndianRupee, FolderKanban, Activity } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import LoadingSpinner from '../common/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Reports = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        pendingQuotesValue: 0,
        completedProjects: 0,
        activeProjects: 0
    });
    const [chartData, setChartData] = useState([]);
    const [rawData, setRawData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReportData();
    }, []);

    const fetchReportData = async () => {
        try {
            const [quotesSnap, projectsSnap] = await Promise.all([
                getDocs(collection(db, 'quotes')),
                getDocs(collection(db, 'projects'))
            ]);

            const quotes = quotesSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'Quote' }));
            const projects = projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'Project' }));

            const completedQuotes = quotes.filter(q => q.status === 'Approved' || q.status === 'Completed');
            const totalRevenue = completedQuotes.reduce((sum, q) => sum + (Number(q.totalCost) || Number(q.amount) || 0), 0);
            const pendingQuotes = quotes.filter(q => q.status === 'Pending');
            const pendingValue = pendingQuotes.reduce((sum, q) => sum + (Number(q.totalCost) || Number(q.amount) || 0), 0);
            const completedProj = projects.filter(p => p.status === 'Completed').length;
            const activeProj = projects.filter(p => p.status === 'In Progress').length;

            setStats({ totalRevenue, pendingQuotesValue: pendingValue, completedProjects: completedProj, activeProjects: activeProj });
            setChartData([{ name: 'Revenue', amount: totalRevenue }, { name: 'Pipeline', amount: pendingValue }]);

            const formattedQuotes = quotes.map(q => ({
                id: q.id,
                date: q.createdAt ? new Date(q.createdAt).toLocaleDateString() : 'N/A',
                customer: q.customerName || 'N/A',
                status: q.status,
                amount: q.totalCost || q.amount || 0
            })).sort((a, b) => new Date(b.date) - new Date(a.date));

            setRawData(formattedQuotes);
        } catch (error) {
            console.error("Error fetching report data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        const headers = ['ID,Date,Customer,Status,Amount (INR)'];
        const rows = rawData.map(row => `${row.id},${row.date},"${row.customer}",${row.status},${row.amount}`);
        const csvContent = [headers, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `financial_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <LoadingSpinner text="Generating analytics..." />;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple text-glow">
                        Analytics & Reports
                    </h1>
                    <p className="text-gray-400 mt-1">Financial overview and business intelligence</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 hover:text-white transition-all shadow-[0_0_10px_rgba(74,222,128,0.2)]"
                >
                    <Download className="w-4 h-4" />
                    Export to Excel
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Total Revenue', value: stats.totalRevenue, icon: IndianRupee, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
                    { title: 'Pipeline Value', value: stats.pendingQuotesValue, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                    { title: 'Active Projects', value: stats.activeProjects, icon: FolderKanban, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', isCount: true },
                    { title: 'Completed Projects', value: stats.completedProjects, icon: BarChart3, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', isCount: true }
                ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className={`glass-panel p-6 rounded-2xl border ${stat.border} relative overflow-hidden group`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-white">
                                {stat.isCount ? stat.value : `₹${stat.value.toLocaleString()}`}
                            </h3>
                        </div>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-neon">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-neon-blue" />
                        Financial Overview
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000000dd', border: '1px solid #ffffff20', borderRadius: '8px', color: '#fff' }}
                                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                                />
                                <Legend />
                                <Bar dataKey="amount" fill="#8b5cf6" name="Amount (INR)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-neon overflow-hidden">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-neon-purple" />
                        Recent Transactions
                    </h3>
                    <div className="overflow-y-auto max-h-80 custom-scrollbar">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 sticky top-0 backdrop-blur-md">
                                <tr>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-400">Date</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-400">Customer</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-400">Amount</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-400">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {rawData.slice(0, 8).map((row, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 text-gray-400 text-sm">{row.date}</td>
                                        <td className="px-4 py-3 font-medium text-white">{row.customer}</td>
                                        <td className="px-4 py-3 text-green-400 font-mono text-sm">₹{row.amount?.toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs rounded-full border ${row.status === 'Approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                    row.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                                }`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
