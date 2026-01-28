import React, { useState, useEffect } from 'react';
import { FileText, Search, Check, X, Clock, Filter, Sparkles, IndianRupee, Calendar, User, Mail, ArrowRight, Edit, RotateCcw } from 'lucide-react';
import { collection, onSnapshot, doc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useToast } from '../common/Toast';
import LoadingSpinner from '../common/LoadingSpinner';
import GlassCard from '../common/GlassCard';
import AnimatedBackground from '../common/AnimatedBackground';
import PremiumButton from '../common/PremiumButton';

const Quotes = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingQuote, setEditingQuote] = useState(null);
    const [products, setProducts] = useState([]);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'products'));
                setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (err) {
                console.error("Error fetching referential products:", err);
            }
        };
        fetchProducts();

        setLoading(true);
        const unsubscribe = onSnapshot(collection(db, 'quotes'), (snap) => {
            const quotesData = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setQuotes(quotesData.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt) : 0;
                const dateB = b.createdAt ? new Date(b.createdAt) : 0;
                return dateB - dateA;
            }));
            setLoading(false);
        }, (error) => {
            console.error("Error fetching quotes:", error);
            showToast('Failed to fetch quotes', 'error');
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        if (newStatus === 'Approved') {
            const quote = quotes.find(q => q.id === id);
            if (!quote || (Number(quote.estimatedCost) || Number(quote.totalCost) || 0) === 0) {
                showToast('Cannot approve a quote with zero valuation. Please edit and set a value first.', 'error');
                return;
            }
        }
        try {
            await updateDoc(doc(db, 'quotes', id), {
                status: newStatus,
                updatedAt: new Date().toISOString()
            });
            showToast(`Quote ${newStatus.toLowerCase()} successfully`, 'success');
        } catch (error) {
            console.error("Error updating status:", error);
            showToast('Failed to update status', 'error');
        }
    };

    const handleUpdateQuote = async (e) => {
        e.preventDefault();
        try {
            const quoteRef = doc(db, 'quotes', editingQuote.id);
            await updateDoc(quoteRef, {
                productName: editingQuote.productName,
                estimatedCost: Number(editingQuote.estimatedCost) || Number(editingQuote.totalCost) || 0,
                area: Number(editingQuote.area) || 0, // Ensure area is a number, default to 0
                notes: editingQuote.notes || '',
                updatedAt: new Date().toISOString()
            });
            showToast('Proposal details synchronized successfully', 'success');
            setIsEditModalOpen(false);
            setEditingQuote(null);
        } catch (error) {
            console.error("Error updating quote:", error);
            showToast('Failed to synchronize proposal details', 'error');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
            case 'Pending':
                return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
            case 'Rejected':
                return 'bg-error-500/10 text-error-500 border-error-500/30';
            default:
                return 'bg-slate-500/10 text-slate-500 border-slate-500/30';
        }
    };

    const filteredQuotes = quotes.filter(quote => {
        const matchesSearch =
            quote.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quote.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quote.productName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || quote.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) return <LoadingSpinner text="Reviewing premium proposals..." />;

    return (
        <div className="space-y-8 relative">
            <AnimatedBackground />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="animate-fade-in">
                    <h1 className="text-4xl font-black text-slate-950 flex items-center gap-3">
                        <FileText className="w-10 h-10 text-premium-cyan animate-float" />
                        <span className="gradient-text">Quote Proposals</span>
                    </h1>
                    <p className="text-slate-600 mt-2 font-medium">Review and validate high-tier fencing requests</p>
                </div>
                <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <div className="px-4 py-2 bg-white shadow-premium rounded-xl flex items-center gap-2 border border-slate-100">
                        <Clock className="w-5 h-5 text-amber-500" />
                        <span className="text-sm font-bold text-slate-700">
                            {quotes.filter(q => q.status === 'Pending').length} Pending Review
                        </span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <GlassCard className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="flex flex-col lg:flex-row gap-6 items-center">
                    <div className="relative flex-1 group w-full">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-premium-cyan transition-colors" />
                        <input
                            type="text"
                            placeholder="Identify quote by customer or product..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-premium-cyan/10 focus:border-premium-cyan transition-all font-medium"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                        {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`flex-1 lg:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${statusFilter === status
                                    ? 'bg-slate-950 text-white shadow-glow'
                                    : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-100'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </GlassCard>

            {/* Quotes Display */}
            <GlassCard className="animate-fade-in-up p-0 overflow-hidden" style={{ animationDelay: '300ms' }}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/50 border-b border-slate-200">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Client Identity</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Selected Solution</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Valuation</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Timestamp</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Validation</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredQuotes.length > 0 ? (
                                filteredQuotes.map((quote, index) => (
                                    <tr
                                        key={quote.id}
                                        className="group hover:bg-slate-50/50 transition-colors animate-fade-in-up"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-tr from-slate-100 to-white rounded-xl flex items-center justify-center border border-slate-200 group-hover:scale-110 transition-transform">
                                                    <User className="w-5 h-5 text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-950 group-hover:text-premium-cyan transition-colors">
                                                        {quote.customerName || quote.clientName || 'Anonymous User'}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <Mail className="w-3 h-3 text-slate-300" />
                                                        <p className="text-[10px] text-slate-400 font-bold tracking-tight">{quote.clientEmail}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <p className="text-sm font-black text-slate-800">{quote.productName || 'Custom Specification'}</p>
                                                {quote.area && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Sparkles className="w-3 h-3 text-premium-cyan" />
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{quote.area} SQ FT Precision</p>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-1">
                                                    <IndianRupee className={`w-4 h-4 ${(Number(quote.estimatedCost) || Number(quote.totalCost)) ? 'text-slate-950' : 'text-rose-500'}`} />
                                                    <span className={`text-xl font-black tabular-nums ${(Number(quote.estimatedCost) || Number(quote.totalCost)) ? 'text-slate-950' : 'text-rose-500 animate-pulse'}`}>
                                                        {(Number(quote.estimatedCost) || Number(quote.totalCost) || 0).toLocaleString('en-IN')}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mt-1">
                                                    {(Number(quote.estimatedCost) || Number(quote.totalCost)) ? 'Net Valuation' : 'Action Required'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Calendar className="w-4 h-4 text-slate-300" />
                                                <span className="text-xs font-bold font-mono">
                                                    {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(quote.status)} shadow-sm`}>
                                                {quote.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingQuote(quote);
                                                        setIsEditModalOpen(true);
                                                    }}
                                                    className="w-10 h-10 flex items-center justify-center bg-white text-premium-cyan rounded-xl shadow-premium border border-slate-100 hover:bg-premium-cyan hover:text-white hover:glow-sm transition-all active:scale-90"
                                                    title="Edit Details"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>

                                                {quote.status !== 'Approved' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(quote.id, 'Approved')}
                                                        className="w-10 h-10 flex items-center justify-center bg-white text-emerald-500 rounded-xl shadow-premium border border-slate-100 hover:bg-emerald-500 hover:text-white hover:glow-success transition-all active:scale-90"
                                                        title="Authorize Proposal"
                                                    >
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                )}

                                                {quote.status !== 'Rejected' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(quote.id, 'Rejected')}
                                                        className="w-10 h-10 flex items-center justify-center bg-white text-error-500 rounded-xl shadow-premium border border-slate-100 hover:bg-error-500 hover:text-white hover:glow-error transition-all active:scale-90"
                                                        title="Dismiss Proposal"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                )}

                                                {quote.status !== 'Pending' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(quote.id, 'Pending')}
                                                        className="w-10 h-10 flex items-center justify-center bg-white text-slate-400 rounded-xl shadow-premium border border-slate-100 hover:bg-slate-900 hover:text-white transition-all active:scale-90"
                                                        title="Reset to Pending"
                                                    >
                                                        <RotateCcw className="w-4 h-4" />
                                                    </button>
                                                )}

                                                <button className="w-10 h-10 flex items-center justify-center bg-white text-slate-400 rounded-xl shadow-premium border border-slate-100 hover:text-premium-cyan transition-all">
                                                    <ArrowRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center">
                                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200">
                                            <FileText className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 mb-2">Null Proposals Detected</h3>
                                        <p className="text-slate-500 font-medium">No quote requests match the current filtration set.</p>
                                        <PremiumButton variant="outline" className="mt-8" onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}>
                                            Reset Filter Stack
                                        </PremiumButton>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            {/* Edit Quote Modal */}
            {isEditModalOpen && editingQuote && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
                    <div
                        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-fade-in"
                        onClick={() => setIsEditModalOpen(false)}
                    />

                    <GlassCard
                        className="relative w-full max-w-xl animate-zoom-in overflow-hidden !p-0 shadow-2xl border-white/20"
                    >
                        {/* Modal Header */}
                        <div className="p-8 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800">
                            <div>
                                <h3 className="text-2xl font-black text-white flex items-center gap-3">
                                    <Edit className="w-6 h-6 text-premium-cyan" />
                                    Refine Proposal
                                </h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Refining Specs for ID: #{editingQuote.id.slice(0, 8)}</p>
                            </div>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                            >
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleUpdateQuote} className="p-8 space-y-6 bg-slate-900/50">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Selected Technical Solution</label>
                                <input
                                    type="text"
                                    value={editingQuote.productName || ''}
                                    onChange={(e) => setEditingQuote({ ...editingQuote, productName: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-4 focus:ring-premium-cyan/10 focus:border-premium-cyan transition-all font-bold"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Net Valuation (₹)</label>
                                    <input
                                        type="number"
                                        value={editingQuote.estimatedCost !== undefined ? editingQuote.estimatedCost : (editingQuote.totalCost || 0)}
                                        onChange={(e) => setEditingQuote({ ...editingQuote, estimatedCost: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-4 focus:ring-premium-cyan/10 focus:border-premium-cyan transition-all font-black text-lg tabular-nums"
                                        required
                                    />
                                    {editingQuote.area > 0 && products.find(p => p.id === editingQuote.productId || p.name === editingQuote.productName) && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const product = products.find(p => p.id === editingQuote.productId || p.name === editingQuote.productName);
                                                const basePrice = editingQuote.basePriceAtRequest || product.basePrice || 0;
                                                const suggested = Number(editingQuote.area) * basePrice;
                                                setEditingQuote({ ...editingQuote, estimatedCost: suggested });
                                                showToast(`Valuation auto-calculated at ₹${basePrice}/sqft`, 'info');
                                            }}
                                            className="mt-2 text-[9px] font-black text-premium-cyan uppercase tracking-widest hover:underline flex items-center gap-1"
                                        >
                                            <RotateCcw className="w-3 h-3" /> Use Suggested: ₹{(Number(editingQuote.area) * (editingQuote.basePriceAtRequest || products.find(p => p.id === editingQuote.productId || p.name === editingQuote.productName)?.basePrice || 0)).toLocaleString()}
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Scale (SQ FT)</label>
                                    <input
                                        type="number"
                                        value={editingQuote.area !== undefined ? editingQuote.area : 0}
                                        onChange={(e) => setEditingQuote({ ...editingQuote, area: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-4 focus:ring-premium-cyan/10 focus:border-premium-cyan transition-all font-black text-lg"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Internal Intelligence Notes</label>
                                <textarea
                                    value={editingQuote.notes || ''}
                                    onChange={(e) => setEditingQuote({ ...editingQuote, notes: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-4 focus:ring-premium-cyan/10 focus:border-premium-cyan transition-all font-medium min-h-[120px] resize-none"
                                    placeholder="Add assessment remarks..."
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 py-4 bg-white/5 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all active:scale-95"
                                >
                                    Discard Changes
                                </button>
                                <PremiumButton
                                    type="submit"
                                    variant="primary"
                                    className="flex-[2] py-4 text-slate-950 !shadow-glow"
                                    icon={Check}
                                >
                                    Synchronize Specs
                                </PremiumButton>
                            </div>
                        </form>
                    </GlassCard>
                </div>
            )}

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-premium-cyan/5 rounded-full blur-[150px] pointer-events-none -z-10 animate-blob"></div>
        </div>
    );
};

export default Quotes;
