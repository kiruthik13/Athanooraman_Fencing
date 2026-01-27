import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Eye, Package, Sparkles, Star, ArrowRight, ShieldCheck, Zap, Award } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import ProductDetail from './ProductDetail';
import { useToast } from '../common/Toast';
import GlassCard from '../common/GlassCard';
import PremiumButton from '../common/PremiumButton';
import AnimatedBackground from '../common/AnimatedBackground';
import Carousel from '../common/Carousel';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { showToast } = useToast();

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
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner text="Curating our architectural collection..." />;
    }

    const featuredProducts = products.slice(0, 3);

    return (
        <div className="space-y-16 pb-20 relative">
            <AnimatedBackground />

            {/* Premium Hero Section */}
            <div className="relative overflow-hidden rounded-[3rem] bg-slate-950 p-10 md:p-20 text-white shadow-2xl animate-zoom-in group">
                <div className="absolute inset-0 bg-gradient-to-br from-premium-purple/20 via-transparent to-premium-cyan/10 opacity-50" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-premium-cyan/10 rounded-full blur-[120px] -mr-40 -mt-40 animate-blob" />

                <div className="relative z-10 max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-fade-in-down shadow-glow-sm">
                        <Sparkles className="w-4 h-4 text-premium-cyan" />
                        Aesthetic Excellence 2026
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
                        Defining the <span className="gradient-text">Architectural</span> <br />
                        Boundary of Tomorrow
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-400 mb-10 leading-relaxed font-medium max-w-2xl">
                        Discover elite fencing solutions where high-security <span className="text-white">engineering</span> meets luxury <span className="text-white">design</span>.
                    </p>
                    <div className="flex flex-wrap gap-5">
                        <PremiumButton variant="primary" className="px-10 py-5 text-slate-950 shadow-glow animate-glow-pulse" onClick={() => {
                            const element = document.getElementById('all-products');
                            element?.scrollIntoView({ behavior: 'smooth' });
                        }}>
                            Explore Selection
                        </PremiumButton>
                        <button
                            className="px-10 py-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all active:scale-95 group/btn"
                            onClick={() => showToast('Design process guide curated for you', 'info')}
                        >
                            The Design Process <ArrowRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Featured Showcase */}
            {featuredProducts.length > 0 && (
                <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <div className="flex items-center justify-between px-4">
                        <div>
                            <h2 className="text-3xl font-black text-slate-950">Masterpiece Spotlight</h2>
                            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Selected for exceptional design</p>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center font-black text-[10px] text-slate-400">
                                        USR
                                    </div>
                                ))}
                            </div>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">500+ Properties Secured</span>
                        </div>
                    </div>
                    <Carousel
                        items={featuredProducts}
                        renderItem={(product) => (
                            <div className="relative h-full group cursor-pointer overflow-hidden rounded-[2.5rem]" onClick={() => setSelectedProduct(product)}>
                                <div className="absolute inset-0 bg-slate-950">
                                    <img
                                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1510563800743-aed236490d08?q=80&w=2070&auto=format&fit=crop'}
                                        alt={product.name}
                                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000"
                                    />
                                </div>
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 p-12 pt-40" />
                                <div className="absolute bottom-12 left-12 right-12 text-white transform group-hover:translate-y-[-8px] transition-transform duration-500">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10">Architecture Grade</span>
                                        <div className="flex items-center gap-1 text-premium-cyan">
                                            <Star className="w-3 h-3 fill-current" />
                                            <Star className="w-3 h-3 fill-current" />
                                            <Star className="w-3 h-3 fill-current" />
                                            <Star className="w-3 h-3 fill-current" />
                                            <Star className="w-3 h-3 fill-current" />
                                        </div>
                                    </div>
                                    <h3 className="text-4xl font-black mb-4 tracking-tight">{product.name}</h3>
                                    <p className="text-slate-300 line-clamp-2 max-w-2xl text-lg font-medium leading-relaxed mb-8">{product.description}</p>
                                    <div className="flex items-center gap-8">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Exclusive Rate</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-black text-premium-cyan">₹{product.basePrice}</span>
                                                <span className="text-sm font-bold text-white/40">/ sq ft</span>
                                            </div>
                                        </div>
                                        <PremiumButton variant="primary" className="h-16 w-16 !p-0 rounded-2xl flex items-center justify-center !shadow-glow rotate-0 group-hover:rotate-12 transition-transform">
                                            <ArrowRight className="w-8 h-8 text-slate-950" />
                                        </PremiumButton>
                                    </div>
                                </div>
                            </div>
                        )}
                    />
                </div>
            )}

            {/* Collections Grid */}
            <div id="all-products" className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                    <div>
                        <h2 className="text-4xl font-black text-slate-950">Curated Portfolio</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Browse our high-fidelity inventory</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-black text-premium-purple">{products.length}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Global<br />Units</span>
                        </div>
                        <div className="h-10 w-[1px] bg-slate-200"></div>
                        <button
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-card transition-all font-black text-xs uppercase tracking-widest"
                            onClick={() => showToast('Refining collection matrix...', 'info')}
                        >
                            Refine Search
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {products.length > 0 ? (
                        products.map((product, idx) => (
                            <GlassCard
                                key={product.id}
                                hover
                                className="group flex flex-col h-full animate-fade-in-up p-0 overflow-hidden"
                                style={{ animationDelay: `${300 + idx * 100}ms` }}
                            >
                                <div className="relative aspect-[16/10] overflow-hidden grayscale-[50%] group-hover:grayscale-0 transition-all duration-700">
                                    <img
                                        src={product.images?.[0] || 'https://via.placeholder.com/400x300'}
                                        alt={product.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                                    />
                                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                                        <span className="bg-slate-950/40 backdrop-blur-xl text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 w-max">
                                            {product.category || 'Standard'}
                                        </span>
                                        <div className="bg-emerald-500/80 backdrop-blur-xl text-white p-2 rounded-xl shadow-glow-sm w-max opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ShieldCheck className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-sm flex items-center justify-center p-8">
                                        <PremiumButton variant="primary" className="w-full h-14 text-slate-950 !shadow-glow" onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedProduct(product);
                                        }}>
                                            Review Specifications
                                        </PremiumButton>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-2xl font-black text-slate-950 leading-tight group-hover:text-premium-purple transition-colors">
                                            {product.name}
                                        </h3>
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-1 text-premium-purple">
                                                <Star className="w-4 h-4 fill-current" />
                                                <span className="text-sm font-black">4.9</span>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Rating</span>
                                        </div>
                                    </div>

                                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 line-clamp-2">
                                        {product.description}
                                    </p>

                                    <div className="pt-8 border-t border-slate-100 mt-auto flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Architecture Base</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-black text-slate-900">₹{product.basePrice}</span>
                                                <span className="text-sm font-bold text-slate-400">/ sq ft</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100">
                                                <Zap className="w-4 h-4" />
                                            </div>
                                            <button
                                                onClick={() => setSelectedProduct(product)}
                                                className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center text-white hover:bg-premium-purple hover:shadow-glow transition-all active:scale-90"
                                            >
                                                <ArrowRight className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
                                <Package className="w-12 h-12" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-4">Archive Currently Empty</h3>
                            <p className="text-slate-500 font-medium">Our master artisans are curating new collections. Check back shortly.</p>
                            <PremiumButton variant="outline" className="mt-10" onClick={fetchProducts}>Re-sync Catalog</PremiumButton>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Detail Overlay */}
            {selectedProduct && (
                <ProductDetail
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}

            <div className="absolute top-[20%] -left-60 w-[600px] h-[600px] bg-premium-purple/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-blob" />
            <div className="absolute bottom-[20%] -right-60 w-[600px] h-[600px] bg-premium-cyan/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-blob animation-delay-4000" />
        </div>
    );
};

export default Products;
