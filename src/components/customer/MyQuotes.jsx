import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FileText, Calendar, IndianRupee, CheckCircle, XCircle, Clock, Sparkles, ArrowRight, Filter, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import { useToast } from '../common/Toast';
import GlassCard from '../common/GlassCard';
import PremiumButton from '../common/PremiumButton';
import AnimatedBackground from '../common/AnimatedBackground';
import BillGenerator from './BillGenerator';

const MyQuotes = () => {
    const { currentUser } = useAuth();
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedQuoteForBill, setSelectedQuoteForBill] = useState(null);
    const [showBill, setShowBill] = useState(false);

    useEffect(() => {
        if (currentUser?.email) {
            fetchMyQuotes();
        }
    }, [currentUser]);

    const fetchMyQuotes = async () => {
        try {
            const q = query(
                collection(db, 'quotes'),
                where('clientEmail', '==', currentUser.email)
            );
            const querySnapshot = await getDocs(q);
            const quotesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setQuotes(quotesData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
            console.error('Error fetching quotes:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        const styles = {
            'Pending': {
                bg: 'bg-amber-50',
                text: 'text-amber-600',
                border: 'border-amber-100',
                icon: Clock,
                label: 'In Audit',
                animate: 'animate-pulse'
            },
            'Approved': {
                bg: 'bg-emerald-50',
                text: 'text-emerald-600',
                border: 'border-emerald-100',
                icon: CheckCircle,
                label: 'Verified',
                animate: ''
            },
            'Rejected': {
                bg: 'bg-rose-50',
                text: 'text-rose-600',
                border: 'border-rose-100',
                icon: XCircle,
                label: 'Declined',
                animate: ''
            }
        };
        return styles[status] || {
            bg: 'bg-slate-50',
            text: 'text-slate-600',
            border: 'border-slate-100',
            icon: FileText,
            label: status,
            animate: ''
        };
    };

    const filteredQuotes = statusFilter === 'All'
        ? quotes
        : quotes.filter(q => q.status === statusFilter);

    const handleInitializeExecution = (quote) => {
        if (quote.status !== 'Approved') {
            showToast('Proposal currently in moderation audit', 'info');
            return;
        }

        const dimensions = { length: 0, width: 0, height: 0 };
        const notes = quote.notes || '';

        const lengthMatch = notes.match(/L:(\d+)/);
        const widthMatch = notes.match(/W:(\d+)/);
        const heightMatch = notes.match(/H:(\d+)/);

        if (lengthMatch) dimensions.length = lengthMatch[1];
        if (widthMatch) dimensions.width = widthMatch[1];
        if (heightMatch) dimensions.height = heightMatch[1];

        const area = parseFloat(quote.area) || 0;
        const total = parseFloat(quote.estimatedCost) || 0;
        const laborCost = area * 20;
        const transportCost = area > 1000 ? 6000 : area > 500 ? 4000 : 2500;
        const materialCost = total - laborCost - transportCost;

        const preparedQuote = {
            ...quote,
            calculations: {
                area: area.toFixed(2),
                materialCost: materialCost.toFixed(2),
                laborCost: laborCost.toFixed(2),
                transportCost: transportCost.toFixed(2),
                grandTotal: total.toFixed(2)
            },
            formData: dimensions,
            product: { name: quote.productName },
            customerInfo: {
                name: currentUser?.displayName || 'Elite Client',
                email: currentUser?.email
            }
        };

        setSelectedQuoteForBill(preparedQuote);
        setShowBill(true);
        showToast('Architectural execution bill prepared.', 'success');
    };

    if (loading) {
        return <LoadingSpinner text="Synchronizing your proposal ledger..." />;
    }

    return (
        <div className="space-y-10 relative">
            <AnimatedBackground />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="animate-fade-in">
                    <h1 className="text-4xl font-black text-slate-950 flex items-center gap-3">
                        <FileText className="w-10 h-10 text-premium-purple animate-float" />
                        <span className="gradient-text">Proposal Ledger</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-xs">Track your architectural consultations</p>
                </div>

                <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <div className="relative group hidden sm:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Find Proposal..."
                            className="bg-white border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-premium-purple/10 focus:border-premium-purple transition-all shadow-sm"
                        />
                    </div>
                    <PremiumButton variant="outline" icon={Filter} className="px-6 py-3 text-xs">Filter Hub</PremiumButton>
                </div>
            </div>

            {/* Premium Filter Strip */}
            <div className="flex flex-wrap items-center gap-4 bg-white/50 backdrop-blur-md p-2 rounded-3xl border border-white shadow-premium animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                {['All', 'Pending', 'Approved', 'Rejected'].map((status, idx) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`relative px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 overflow-hidden ${statusFilter === status
                            ? 'bg-slate-950 text-white shadow-glow'
                            : 'text-slate-400 hover:text-slate-950 hover:bg-white'
                            }`}
                    >
                        <span className="relative z-10">{status}</span>
                        {statusFilter === status && (
                            <div className="absolute inset-0 bg-gradient-to-r from-premium-purple/20 to-transparent pointer-events-none" />
                        )}
                    </button>
                ))}
            </div>

            {filteredQuotes.length === 0 ? (
                <GlassCard className="text-center py-32 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <div className="relative w-24 h-24 mx-auto mb-8">
                        <div className="absolute inset-0 bg-slate-100 rounded-3xl rotate-12 animate-pulse"></div>
                        <div className="relative w-full h-full bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100">
                            <FileText className="w-10 h-10 text-slate-200" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-black text-slate-950 mb-3">No Proposals Dispatched</h3>
                    <p className="text-slate-500 font-medium max-w-md mx-auto italic">
                        {statusFilter === 'All'
                            ? 'Your architectural journey begins with your first consultation request.'
                            : `Our records show zero proposals currently categorized as ${statusFilter}.`
                        }
                    </p>
                    {statusFilter === 'All' && (
                        <PremiumButton
                            variant="primary"
                            className="mt-10 animate-glow-pulse"
                            onClick={() => window.location.href = '/customer/dashboard'}
                            icon={Sparkles}
                        >
                            Explore Architecture
                        </PremiumButton>
                    )}
                </GlassCard>
            ) : (
                <div className="grid grid-cols-1 gap-8">
                    {filteredQuotes.map((quote, idx) => {
                        const style = getStatusStyle(quote.status);
                        const StatusIcon = style.icon;

                        return (
                            <GlassCard
                                key={quote.id}
                                hover
                                className="group animate-fade-in-up p-0 overflow-hidden"
                                style={{ animationDelay: `${300 + idx * 100}ms` }}
                            >
                                <div className="flex flex-col lg:flex-row">
                                    {/* Left: Indicator & Main Info */}
                                    <div className="flex-1 p-8 lg:p-10">
                                        <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
                                            <div className="flex items-start gap-5">
                                                <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center border border-white/5 relative group-hover:rotate-6 transition-transform">
                                                    <FileText className="w-7 h-7 text-premium-cyan" />
                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-premium-purple rounded-full animate-ping opacity-20"></div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Proposal ID</span>
                                                        <span className="text-[10px] font-black text-premium-purple uppercase tracking-widest">#{quote.id.slice(0, 8)}</span>
                                                    </div>
                                                    <h3 className="text-3xl font-black text-slate-950 group-hover:text-premium-purple transition-colors">
                                                        {quote.productName || 'Custom Consultation'}
                                                    </h3>
                                                </div>
                                            </div>

                                            <div className={`px-5 py-2 rounded-2xl ${style.bg} ${style.border} border flex items-center gap-3 transition-all group-hover:shadow-sm`}>
                                                <StatusIcon className={`w-4 h-4 ${style.text} ${style.animate}`} />
                                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${style.text}`}>
                                                    {style.label}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <Calendar className="w-3 h-3" /> Dispatch Date
                                                </p>
                                                <p className="text-sm font-black text-slate-950">
                                                    {new Date(quote.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <IndianRupee className="w-3 h-3" /> Financial Estimate
                                                </p>
                                                <p className="text-sm font-black text-slate-950">
                                                    {quote.estimatedCost ? `₹${quote.estimatedCost.toLocaleString()}` : 'In Calculation'}
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <Sparkles className="w-3 h-3" /> Project Scale
                                                </p>
                                                <p className="text-sm font-black text-slate-950">
                                                    {quote.area ? `${quote.area} SQ FT` : 'Pending Dimension'}
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tier Level</p>
                                                <span className="px-3 py-1 bg-slate-950 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">Enterprise</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Actions/Notes Block */}
                                    <div className="w-full lg:w-80 bg-slate-50/50 border-l border-slate-100 p-8 flex flex-col justify-center gap-4">
                                        {quote.notes ? (
                                            <div className="mb-4">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Internal Remarks</p>
                                                <p className="text-xs text-slate-600 italic font-medium line-clamp-3">"{quote.notes}"</p>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3 text-slate-300 mb-4">
                                                <Clock className="w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Moderator Feedback</span>
                                            </div>
                                        )}
                                        <PremiumButton
                                            variant={quote.status === 'Approved' ? 'primary' : 'outline'}
                                            className="w-full text-[10px] font-black tracking-widest"
                                            icon={ArrowRight}
                                            onClick={() => handleInitializeExecution(quote)}
                                        >
                                            {quote.status === 'Approved' ? 'Initialize Execution' : 'Proposal Review'}
                                        </PremiumButton>
                                    </div>
                                </div>
                                <div className="h-1 w-0 bg-gradient-to-r from-premium-purple to-premium-cyan group-hover:w-full transition-all duration-700"></div>
                            </GlassCard>
                        );
                    })}
                </div>
            )}

            {showBill && selectedQuoteForBill && (
                <BillGenerator
                    calculations={selectedQuoteForBill.calculations}
                    formData={selectedQuoteForBill.formData}
                    product={selectedQuoteForBill.product}
                    customerInfo={selectedQuoteForBill.customerInfo}
                    onClose={() => setShowBill(false)}
                />
            )}

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-premium-purple/5 rounded-full blur-[150px] pointer-events-none -z-10 animate-blob"></div>
        </div>
    );
};

export default MyQuotes;
