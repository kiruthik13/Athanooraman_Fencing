import React, { useState } from 'react';
import { X, IndianRupee, Package, CheckCircle, Sparkles, ShieldCheck, Zap, ArrowRight, Layers, Ruler } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../common/Toast';
import GlassCard from '../common/GlassCard';
import PremiumButton from '../common/PremiumButton';

const ProductDetail = ({ product, onClose }) => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    const [requesting, setRequesting] = useState(false);

    const handleRequestQuote = async () => {
        if (!currentUser) {
            showToast('Authentication required for quote request', 'error');
            return;
        }

        setRequesting(true);
        try {
            await addDoc(collection(db, 'quotes'), {
                productId: product.id,
                productName: product.name,
                clientEmail: currentUser.email,
                clientName: currentUser.displayName || currentUser.email,
                status: 'Pending',
                createdAt: new Date().toISOString(),
                isRead: false
            });
            showToast('Proposal request dispatched successfully', 'success');
            onClose();
        } catch (error) {
            console.error('Error requesting quote:', error);
            showToast('Transmission failure in proposal request', 'error');
        } finally {
            setRequesting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-fade-in" onClick={onClose} />

            <GlassCard
                className="w-full max-w-4xl relative z-10 animate-zoom-in bg-white/95 border-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] p-0 overflow-hidden max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-20 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-slate-500 hover:bg-slate-950 hover:text-white hover:rotate-90 transition-all duration-500 shadow-premium"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    <div className="flex flex-col md:flex-row">
                        {/* Visual Asset Container */}
                        <div className="w-full md:w-1/2 relative h-[400px] md:h-auto group">
                            <img
                                src={product.images?.[0] || 'https://images.unsplash.com/photo-1510563800743-aed236490d08?q=80&w=2070&auto=format&fit=crop'}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 pointer-events-none" />
                            <div className="absolute top-8 left-8">
                                <span className="px-4 py-1.5 bg-slate-950/40 backdrop-blur-xl text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-glow-sm">
                                    {product.category || 'Architecture'} Grade
                                </span>
                            </div>
                        </div>

                        {/* Inventory Specification Content */}
                        <div className="w-full md:w-1/2 p-10 md:p-14 space-y-8 animate-fade-in-right">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-premium-purple" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Excellence Standard</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-slate-950 leading-tight tracking-tight">
                                    {product.name}
                                </h2>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-baseline gap-1">
                                        <IndianRupee className="w-5 h-5 text-slate-950" />
                                        <span className="text-4xl font-black text-slate-950 tabular-nums">{product.basePrice.toLocaleString()}</span>
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">/ SQ FT</span>
                                    </div>
                                    <div className="h-8 w-[1px] bg-slate-100 mx-2"></div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1 text-emerald-500">
                                            <ShieldCheck className="w-3 h-3" />
                                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">High-Security<br />Certified</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Layers className="w-3 h-3" /> Narrative & Context
                                </h3>
                                <p className="text-slate-600 font-medium leading-relaxed text-lg italic">
                                    "{product.description}"
                                </p>
                            </div>

                            {/* Expert Features */}
                            {product.features && product.features.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Zap className="w-3 h-3" /> Performance Traits
                                    </h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {product.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100/50 group/item hover:bg-white hover:shadow-card transition-all">
                                                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center border border-slate-100 group-hover/item:border-premium-purple transition-all">
                                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                </div>
                                                <span className="text-sm font-bold text-slate-700 tracking-tight">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Technical Specifications */}
                            {product.specifications && (
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Ruler className="w-3 h-3" /> Technical Datasheet
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.entries(product.specifications).map(([key, value]) => (
                                            <div key={key} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{key}</p>
                                                <p className="text-sm font-black text-slate-900">{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Secure Engagement Bar */}
                <div className="p-10 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-4 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-slate-200 rounded-full" />
                    <button
                        onClick={onClose}
                        className="flex-1 py-5 px-8 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all active:scale-95"
                    >
                        Dismiss Review
                    </button>
                    <PremiumButton
                        onClick={handleRequestQuote}
                        loading={requesting}
                        className="flex-[2] py-5 text-slate-950 !shadow-glow font-black uppercase tracking-[0.2em] text-xs"
                        icon={ArrowRight}
                    >
                        Initialize Proposal Request
                    </PremiumButton>
                </div>
            </GlassCard>
        </div>
    );
};

export default ProductDetail;
