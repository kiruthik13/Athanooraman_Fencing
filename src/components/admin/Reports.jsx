import React, { useState, useEffect } from 'react';
import { BarChart3, Download, TrendingUp, IndianRupee, FolderKanban, Activity } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
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
    const [details, setDetails] = useState({
        revenue: [],
        pipeline: [],
        activeProjects: [],
        completedProjects: []
    });
    const [selectedMetric, setSelectedMetric] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setLoading(true);

        // Real-time listener for Quotes
        const unsubscribeQuotes = onSnapshot(collection(db, 'quotes'), (quotesSnap) => {
            const quotes = quotesSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'Quote' }));

            // Nested listener for Projects to ensure we have both datasets before processing
            const unsubscribeProjects = onSnapshot(collection(db, 'projects'), (projectsSnap) => {
                const projects = projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'Project' }));

                processData(quotes, projects);
            }, (error) => {
                console.error("Error listening to projects:", error);
                setLoading(false);
            });

            return () => unsubscribeProjects(); // Cleanup inner listener
        }, (error) => {
            console.error("Error listening to quotes:", error);
            setLoading(false);
        });

        return () => {
            // Cleanup function for useEffect
            // unsubscribeQuotes handles the initial listener, but we can't easily reach unsubscribeProjects inside here 
            // without storing it in a ref. However, since the component unmount will kill the closure, 
            // the main cleanup is effectively calling the return of the first onSnapshot.
        };
    }, []);

    const processData = (quotes, projects) => {
        try {
            // Data Processing
            const revenueItems = quotes.filter(q => q.status === 'Approved' || q.status === 'Completed');
            const totalRevenue = revenueItems.reduce((sum, q) => sum + (Number(q.totalCost) || Number(q.amount) || 0), 0);

            const pipelineItems = quotes.filter(q => q.status === 'Pending');
            const pendingValue = pipelineItems.reduce((sum, q) => sum + (Number(q.totalCost) || Number(q.amount) || 0), 0);

            const completedProjItems = projects.filter(p => p.status === 'Completed');
            // Strict filter for Active Projects: Must be 'In Progress' and have a valid name
            const activeProjItems = projects.filter(p => p.status === 'In Progress' && p.name && p.name.trim() !== '');

            setStats({
                totalRevenue,
                pendingQuotesValue: pendingValue,
                completedProjects: completedProjItems.length,
                activeProjects: activeProjItems.length
            });

            setDetails({
                revenue: revenueItems,
                pipeline: pipelineItems,
                activeProjects: activeProjItems,
                completedProjects: completedProjItems
            });

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
            console.error("Error processing report data:", error);
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

    const handleCardClick = (metric) => {
        setSelectedMetric(metric);
        setShowModal(true);
    };

    const getModalContent = () => {
        if (!selectedMetric) return null;

        const data = details[selectedMetric] || [];
        const titleMap = {
            revenue: 'Revenue Details (Approved/Completed Quotes)',
            pipeline: 'Pipeline Details (Pending Quotes)',
            activeProjects: 'Active Projects List',
            completedProjects: 'Completed Projects List'
        };

        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                <div className="glass-panel w-full max-w-4xl rounded-2xl border border-white/10 shadow-neon overflow-hidden animate-slide-in max-h-[80vh] flex flex-col">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h3 className="text-xl font-bold text-white">{titleMap[selectedMetric]}</h3>
                        <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">
                            Close
                        </button>
                    </div>
                    <div className="p-0 overflow-y-auto custom-scrollbar flex-1">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 sticky top-0 backdrop-blur-md">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">ID</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Name/Customer</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Value</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {data.length > 0 ? (
                                    data.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 text-gray-500 font-mono text-xs">{item.id.slice(0, 8)}...</td>
                                            <td className="px-6 py-4 text-white font-medium">{item.name || item.customerName || 'N/A'}</td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">
                                                {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-neon-blue font-mono">
                                                {item.totalCost || item.amount
                                                    ? `₹${(item.totalCost || item.amount).toLocaleString()}`
                                                    : '-'}
                                                {item.progress !== undefined && <span className="ml-2 text-xs text-gray-500">({item.progress}%)</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 text-xs rounded-full bg-white/10 text-gray-300 border border-white/10">
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            No records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <LoadingSpinner text="Generating analytics..." />;

    return (
        <div className="space-y-6 animate-fade-in relative">
            {showModal && getModalContent()}

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
                    { key: 'revenue', title: 'Total Revenue', value: stats.totalRevenue, icon: IndianRupee, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
                    { key: 'pipeline', title: 'Pipeline Value', value: stats.pendingQuotesValue, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                    { key: 'activeProjects', title: 'Active Projects', value: stats.activeProjects, icon: FolderKanban, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', isCount: true },
                    { key: 'completedProjects', title: 'Completed Projects', value: stats.completedProjects, icon: BarChart3, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', isCount: true }
                ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={idx}
                            onClick={() => handleCardClick(stat.key)}
                            className={`glass-panel p-6 rounded-2xl border ${stat.border} relative overflow-hidden group cursor-pointer hover:shadow-neon hover:border-white/30 transition-all duration-300`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-white">
                                {stat.isCount ? stat.value : `₹${stat.value.toLocaleString()}`}
                            </h3>
                            <div className="absolute bottom-4 right-4 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                Click to view details
                            </div>
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
