import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FileText, Calendar, IndianRupee, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../common/Toast';

const MyQuotes = () => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (currentUser) {
            fetchMyQuotes();
        }
    }, [currentUser]);

    const fetchMyQuotes = async () => {
        try {
            setLoading(true);
            // Query without orderBy to avoid index requirement
            const q = query(
                collection(db, 'quotes'),
                where('customerId', '==', currentUser.uid)
            );
            const querySnapshot = await getDocs(q);
            const quotesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Sort in JavaScript instead of Firestore
            quotesData.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
                const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
                return dateB - dateA; // Newest first
            });

            setQuotes(quotesData);
        } catch (error) {
            console.error('Error fetching quotes:', error);
            showToast('Failed to load your quotes', 'error');
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            'Pending': {
                icon: Clock,
                color: 'yellow',
                bgClass: 'bg-yellow-500/10',
                textClass: 'text-yellow-400',
                borderClass: 'border-yellow-500/20',
                label: 'Under Review'
            },
            'Approved': {
                icon: CheckCircle,
                color: 'green',
                bgClass: 'bg-green-500/10',
                textClass: 'text-green-400',
                borderClass: 'border-green-500/20',
                label: 'Approved'
            },
            'Rejected': {
                icon: XCircle,
                color: 'red',
                bgClass: 'bg-red-500/10',
                textClass: 'text-red-400',
                borderClass: 'border-red-500/20',
                label: 'Rejected'
            },
            'Completed': {
                icon: CheckCircle,
                color: 'blue',
                bgClass: 'bg-neon-blue/10',
                textClass: 'text-neon-blue',
                borderClass: 'border-neon-blue/20',
                label: 'Completed'
            }
        };
        return configs[status] || configs['Pending'];
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const filteredQuotes = quotes.filter(quote => {
        if (filter === 'all') return true;
        return quote.status === filter;
    });

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">My Quotes & Proposals</h2>
                <p className="text-gray-400 mt-1">Track your quote requests and their status</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {['all', 'Pending', 'Approved', 'Rejected', 'Completed'].map(filterOption => (
                    <button
                        key={filterOption}
                        onClick={() => setFilter(filterOption)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${filter === filterOption
                            ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 text-white border border-neon-blue/30'
                            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
                            }`}
                    >
                        {filterOption === 'all' ? 'All' : filterOption}
                        <span className="ml-2 text-xs">
                            ({quotes.filter(q => filterOption === 'all' || q.status === filterOption).length})
                        </span>
                    </button>
                ))}
            </div>

            {/* Quotes List */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="spinner"></div>
                </div>
            ) : filteredQuotes.length === 0 ? (
                <div className="card text-center py-16">
                    <FileText className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Quotes Yet</h3>
                    <p className="text-gray-400 mb-6">
                        {filter === 'all'
                            ? "You haven't requested any quotes yet. Use the Calculator to get started!"
                            : `No ${filter.toLowerCase()} quotes found.`
                        }
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredQuotes.map((quote) => {
                        const statusConfig = getStatusConfig(quote.status);
                        const StatusIcon = statusConfig.icon;

                        return (
                            <div
                                key={quote.id}
                                className="card hover:border-neon-blue/30 transition-all duration-300"
                            >
                                {/* Header */}
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center border border-neon-blue/30">
                                            <FileText className="w-6 h-6 text-neon-blue" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">Quote Request</h3>
                                            <p className="text-xs text-gray-400 font-mono">ID: {quote.id.slice(0, 12)}</p>
                                        </div>
                                    </div>
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${statusConfig.bgClass} ${statusConfig.textClass} ${statusConfig.borderClass}`}>
                                        <StatusIcon className="w-4 h-4" />
                                        <span className="font-semibold">{statusConfig.label}</span>
                                    </div>
                                </div>

                                {/* Project Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Package className="w-4 h-4 text-neon-purple" />
                                            <p className="text-xs text-gray-400">Product</p>
                                        </div>
                                        <p className="text-sm font-semibold text-white truncate">
                                            {quote.product?.name || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Calendar className="w-4 h-4 text-neon-blue" />
                                            <p className="text-xs text-gray-400">Requested On</p>
                                        </div>
                                        <p className="text-sm font-semibold text-white">
                                            {formatDate(quote.createdAt)}
                                        </p>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                        <p className="text-xs text-gray-400 mb-1">Project Area</p>
                                        <p className="text-sm font-semibold text-white">
                                            {quote.projectDetails?.area || 'N/A'} sq ft
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-lg p-3 border border-neon-blue/30">
                                        <p className="text-xs text-gray-400 mb-1">Total Cost</p>
                                        <p className="text-lg font-bold text-white flex items-center gap-1">
                                            <IndianRupee className="w-4 h-4 text-neon-blue" />
                                            {(quote.totalCost || quote.amount || 0).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>

                                {/* Cost Breakdown */}
                                {quote.costBreakdown && (
                                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                        <p className="text-sm font-semibold text-gray-300 mb-3">Cost Breakdown</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                            <div>
                                                <p className="text-gray-400 text-xs">Material</p>
                                                <p className="text-white font-semibold">₹{quote.costBreakdown.materialCost?.toLocaleString('en-IN')}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-xs">Labor</p>
                                                <p className="text-white font-semibold">₹{quote.costBreakdown.laborCost?.toLocaleString('en-IN')}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-xs">Transport</p>
                                                <p className="text-white font-semibold">₹{quote.costBreakdown.transportCost?.toLocaleString('en-IN')}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-xs">Dimensions</p>
                                                <p className="text-white font-semibold">
                                                    {quote.projectDetails?.length} × {quote.projectDetails?.width} × {quote.projectDetails?.height} ft
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Description */}
                                {quote.description && (
                                    <div className="mt-3 pt-3 border-t border-white/10">
                                        <p className="text-sm text-gray-400">{quote.description}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyQuotes;
