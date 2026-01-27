import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Calculator as CalcIcon, IndianRupee, Sparkles, Ruler, ArrowRight, Zap, ShieldCheck, Factory, Truck, HardHat } from 'lucide-react';
import { useToast } from '../common/Toast';
import { useAuth } from '../../contexts/AuthContext';
import GlassCard from '../common/GlassCard';
import AnimatedBackground from '../common/AnimatedBackground';
import PremiumButton from '../common/PremiumButton';

const Calculator = () => {
    const { showToast } = useToast();
    const { currentUser, userProfile } = useAuth();
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        length: '',
        width: '',
        height: '',
        productId: ''
    });

    const [calculations, setCalculations] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'products'));
            const productsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsData);
            if (productsData.length > 0) {
                setFormData(prev => ({ ...prev, productId: productsData[0].id }));
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const calculateCosts = () => {
        const { length, width, height, productId } = formData;

        if (!length || !width || !height || !productId) {
            showToast('Technical parameters required for calculation', 'warning');
            return;
        }

        setIsCalculating(true);

        // Simulate "AI Calculation" delay for premium feel
        setTimeout(() => {
            const product = products.find(p => p.id === productId);
            if (!product) {
                setIsCalculating(false);
                return;
            }

            const area = parseFloat(length) * parseFloat(height) * 2 + parseFloat(width) * parseFloat(height) * 2;
            const materialCost = area * product.basePrice;
            const laborCost = area * 20; // ₹20 per sq ft labor
            const transportCost = area > 1000 ? 6000 : area > 500 ? 4000 : 2500;
            const grandTotal = materialCost + laborCost + transportCost;

            setCalculations({
                area: area.toFixed(2),
                materialCost: materialCost.toFixed(2),
                laborCost: laborCost.toFixed(2),
                transportCost: transportCost.toFixed(2),
                grandTotal: grandTotal.toFixed(2),
                productName: product.name,
                productId: product.id
            });
            setIsCalculating(false);
            showToast('Project metrics computed', 'success');
        }, 800);
    };

    const handleGenerateQuote = async () => {
        if (!calculations) {
            showToast('Compute costs before proceeding', 'warning');
            return;
        }

        setIsSubmitting(true);
        try {
            const quoteData = {
                clientEmail: currentUser?.email || 'guest@example.com',
                clientName: userProfile?.fullName || currentUser?.displayName || 'Elite Guest',
                productName: calculations.productName,
                productId: calculations.productId,
                area: calculations.area,
                estimatedCost: parseFloat(calculations.grandTotal),
                status: 'Pending',
                notes: `System Calculated - Dimensions: L:${formData.length}ft, W:${formData.width}ft, H:${formData.height}ft`,
                createdAt: new Date().toISOString(),
                isRead: false
            };

            await addDoc(collection(db, 'quotes'), quoteData);
            showToast('Proposal request dispatched', 'success');

            setFormData({
                length: '',
                width: '',
                height: '',
                productId: products[0]?.id || ''
            });
            setCalculations(null);
        } catch (error) {
            console.error('Error generating quote:', error);
            showToast('Dispatch failed', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-12 relative pb-20">
            <AnimatedBackground />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                <div className="animate-fade-in">
                    <h1 className="text-4xl font-black text-slate-950 flex items-center gap-3">
                        <CalcIcon className="w-10 h-10 text-premium-purple animate-spin-slow" />
                        <span className="gradient-text">Precision Analytics</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-xs">Architectural cost modeling and assessment</p>
                </div>
                <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <div className="px-5 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm text-[10px] font-black uppercase tracking-widest">
                        Model: <span className="text-premium-purple">Athanuramman Fencing v4.2</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Input Matrix */}
                <GlassCard className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-8">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                            <Ruler className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-950">Structural Inputs</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Specify site dimensions</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* High-End Product Selection */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Material Selection</label>
                            <div className="relative group">
                                <Factory className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-premium-purple" />
                                <select
                                    name="productId"
                                    value={formData.productId}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-3xl py-5 pl-14 pr-6 text-slate-950 focus:outline-none focus:ring-4 focus:ring-premium-purple/10 focus:border-premium-purple transition-all font-bold group-hover:bg-white appearance-none cursor-pointer"
                                >
                                    {products.map(product => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} — ₹{product.basePrice}/sq ft
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Dimensions Grid */}
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Site Length</label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        name="length"
                                        value={formData.length}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50/50 border border-slate-200 rounded-3xl py-5 px-8 text-slate-950 focus:outline-none focus:ring-4 focus:ring-premium-purple/10 focus:border-premium-purple transition-all font-black text-xl group-hover:bg-white"
                                        placeholder="00"
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest">FEET</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Site Width</label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        name="width"
                                        value={formData.width}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50/50 border border-slate-200 rounded-3xl py-5 px-8 text-slate-950 focus:outline-none focus:ring-4 focus:ring-premium-purple/10 focus:border-premium-purple transition-all font-black text-xl group-hover:bg-white"
                                        placeholder="00"
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest">FEET</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vertical Elevation (Height)</label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-3xl py-5 px-8 text-slate-950 focus:outline-none focus:ring-4 focus:ring-premium-purple/10 focus:border-premium-purple transition-all font-black text-xl group-hover:bg-white"
                                    placeholder="Enter Height"
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest">FEET</span>
                            </div>
                        </div>

                        <PremiumButton
                            onClick={calculateCosts}
                            loading={isCalculating}
                            className="w-full py-6 text-slate-950 !shadow-glow font-black uppercase tracking-[0.2em] text-xs"
                            icon={Zap}
                        >
                            Execute Modeling
                        </PremiumButton>
                    </div>
                </GlassCard>

                {/* Computational Output */}
                <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                    <div className="h-full bg-slate-950 rounded-[3rem] p-10 md:p-14 relative overflow-hidden shadow-deep group">
                        {/* Aesthetic Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-br from-premium-purple/20 to-transparent pointer-events-none opacity-50" />
                        <div className="absolute bottom-0 right-0 w-80 h-80 bg-premium-cyan/10 rounded-full blur-[100px] -mr-40 -mb-40" />

                        <div className="relative z-10 h-full flex flex-col">
                            <div className="flex items-center gap-4 mb-12">
                                <div className="w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-premium-cyan" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white">Cost Architecture</h3>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Simulated valuation report</p>
                                </div>
                            </div>

                            {calculations ? (
                                <div className="space-y-10 flex-1 flex flex-col">
                                    {/* Primary Metric */}
                                    <div className="bg-white/5 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 group-hover:border-premium-purple/30 transition-all">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Surface Area</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-black text-white tracking-tighter">{calculations.area}</span>
                                            <span className="text-lg font-black text-premium-cyan">SQ FT</span>
                                        </div>
                                    </div>

                                    {/* Line Item Ledger */}
                                    <div className="space-y-6">
                                        {[
                                            { label: 'Architectural Material', value: calculations.materialCost, icon: Factory },
                                            { label: 'Elite Execution Force', value: calculations.laborCost, icon: HardHat },
                                            { label: 'Logistics Deployment', value: calculations.transportCost, icon: Truck },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between group/line">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/line:border-premium-purple transition-all">
                                                        <item.icon className="w-4 h-4 text-slate-400 group-hover/line:text-premium-purple transition-all" />
                                                    </div>
                                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                                                </div>
                                                <span className="text-xl font-black text-white">₹{parseFloat(item.value).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Grand Total Terminal */}
                                    <div className="mt-auto pt-10 border-t border-white/10">
                                        <div className="bg-gradient-to-r from-premium-purple to-premium-cyan p-1 rounded-[2rem] shadow-glow">
                                            <div className="bg-slate-950 rounded-[1.9rem] p-8 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Final Investment Valuation</p>
                                                    <div className="flex items-center gap-3">
                                                        <IndianRupee className="w-8 h-8 text-white" />
                                                        <span className="text-5xl font-black text-white tracking-tighter">
                                                            {parseFloat(calculations.grandTotal).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="hidden md:block">
                                                    <ShieldCheck className="w-12 h-12 text-emerald-500/20" />
                                                </div>
                                            </div>
                                        </div>

                                        <PremiumButton
                                            onClick={handleGenerateQuote}
                                            loading={isSubmitting}
                                            className="w-full mt-8 py-6 !bg-white !text-slate-950 hover:!bg-premium-cyan transition-all font-black uppercase tracking-[0.2em] text-xs"
                                            icon={ArrowRight}
                                        >
                                            Submit Formal Proposal
                                        </PremiumButton>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center py-20 text-center opacity-40 group-hover:opacity-100 transition-opacity">
                                    <div className="relative w-24 h-24 mb-6">
                                        <div className="absolute inset-0 bg-white/5 rounded-3xl rotate-12 animate-pulse" />
                                        <div className="relative w-full h-full bg-slate-900 rounded-3xl flex items-center justify-center border border-white/10">
                                            <Zap className="w-10 h-10 text-slate-700" />
                                        </div>
                                    </div>
                                    <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] max-w-[200px]">
                                        Awaiting site parameters for cost simulation
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute top-[20%] -left-64 w-[600px] h-[600px] bg-premium-purple/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-blob" />
        </div>
    );
};

export default Calculator;
