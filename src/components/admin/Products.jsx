import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit, Trash2, X, Sparkles, Filter, IndianRupee, Layers, LayoutGrid, List } from 'lucide-react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useToast } from '../common/Toast';
import LoadingSpinner from '../common/LoadingSpinner';
import GlassCard from '../common/GlassCard';
import PremiumButton from '../common/PremiumButton';
import AnimatedBackground from '../common/AnimatedBackground';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const { showToast } = useToast();

    const [newProduct, setNewProduct] = useState({
        name: '',
        category: '',
        basePrice: '',
        description: '',
        imageUrl: ''
    });

    useEffect(() => {
        setLoading(true);
        const unsubscribe = onSnapshot(collection(db, 'products'), (snap) => {
            const productsData = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching products:", error);
            showToast('Failed to fetch products', 'error');
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleAddOrUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            if (!newProduct.name || !newProduct.basePrice) {
                showToast('Please fill in required fields', 'error');
                return;
            }

            const productData = {
                ...newProduct,
                basePrice: Number(newProduct.basePrice),
                images: newProduct.imageUrl ? [newProduct.imageUrl] : []
            };

            if (editingId) {
                await updateDoc(doc(db, 'products', editingId), {
                    ...productData,
                    updatedAt: new Date().toISOString()
                });
                showToast('Product updated successfully', 'success');
            } else {
                await addDoc(collection(db, 'products'), {
                    ...productData,
                    createdAt: new Date().toISOString()
                });
                showToast('Product added successfully', 'success');
            }

            closeModal();
        } catch (error) {
            console.error("Error saving product:", error);
            showToast('Failed to save product', 'error');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteDoc(doc(db, 'products', id));
                showToast('Product deleted successfully', 'success');
            } catch (error) {
                console.error("Error deleting product:", error);
                showToast('Failed to delete product', 'error');
            }
        }
    };

    const handleEditClick = (product) => {
        setEditingId(product.id);
        setNewProduct({
            name: product.name || '',
            category: product.category || '',
            basePrice: product.basePrice || '',
            description: product.description || '',
            imageUrl: product.images?.[0] || ''
        });
        setShowAddModal(true);
    };

    const closeModal = () => {
        setShowAddModal(false);
        setEditingId(null);
        setNewProduct({ name: '', category: '', basePrice: '', description: '', imageUrl: '' });
    };

    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <LoadingSpinner text="Optimizing product catalog..." />;

    return (
        <div className="space-y-8 relative">
            <AnimatedBackground />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="animate-fade-in">
                    <h1 className="text-4xl font-black text-slate-950 flex items-center gap-3">
                        <Package className="w-10 h-10 text-premium-cyan animate-float" />
                        <span className="gradient-text">Product Inventory</span>
                    </h1>
                    <p className="text-slate-600 mt-2 font-medium">Curate your premium fencing collections</p>
                </div>
                <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <div className="flex items-center bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-premium-cyan text-slate-950 shadow-glow' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-premium-cyan text-slate-950 shadow-glow' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                    <PremiumButton onClick={() => setShowAddModal(true)} icon={Plus} className="shadow-glow animate-glow-pulse">
                        Add Collection
                    </PremiumButton>
                </div>
            </div>

            {/* Search & Filters */}
            <GlassCard className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="relative flex-1 group w-full">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-premium-cyan transition-colors" />
                        <input
                            type="text"
                            placeholder="Search catalog by name or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-premium-cyan/10 focus:border-premium-cyan transition-all font-medium"
                        />
                    </div>
                    <PremiumButton variant="outline" icon={Filter} className="w-full md:w-auto">
                        Refine Search
                    </PremiumButton>
                </div>
            </GlassCard>

            {/* Products Display */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <GlassCard
                                key={product.id}
                                className="group animate-fade-in-up flex flex-col p-0 overflow-hidden"
                                style={{ animationDelay: `${300 + index * 50}ms` }}
                            >
                                <div className="relative h-64 overflow-hidden">
                                    {product.images?.[0] ? (
                                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                            <Package className="w-16 h-16 text-slate-300" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                        <button
                                            onClick={() => handleEditClick(product)}
                                            className="p-3 bg-white/90 backdrop-blur-md rounded-xl text-slate-900 shadow-xl hover:bg-premium-cyan hover:glow transition-all"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="p-3 bg-white/90 backdrop-blur-md rounded-xl text-error-600 shadow-xl hover:bg-error-500 hover:text-white transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-4 left-4">
                                        <span className="px-3 py-1 bg-slate-950/40 backdrop-blur-md text-white border border-white/20 rounded-full text-xs font-black uppercase tracking-widest">
                                            {product.category || 'Standard'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-xl font-black text-slate-950 mb-3 group-hover:text-premium-cyan transition-colors line-clamp-1">{product.name}</h3>
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rate</span>
                                            <div className="flex items-center gap-1">
                                                <IndianRupee className="w-4 h-4 text-premium-cyan" />
                                                <span className="text-2xl font-black text-slate-900">{product.basePrice.toLocaleString()}</span>
                                                <span className="text-xs text-slate-500 font-bold mb-1">/sqft</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Layers className="w-4 h-4 text-slate-400" />
                                            <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">{product.id.slice(0, 8)}</span>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <GlassCard className="py-20 text-center animate-zoom-in">
                                <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-900">No matching luxury items</h3>
                                <PremiumButton variant="outline" className="mt-6" onClick={() => setSearchTerm('')}>Reset Search</PremiumButton>
                            </GlassCard>
                        </div>
                    )}
                </div>
            ) : (
                <GlassCard className="animate-fade-in-up p-0 overflow-hidden" style={{ animationDelay: '300ms' }}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50/50 border-b border-slate-200">
                                <tr>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Luxury Product</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Category</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Base Rate</th>
                                    <th className="px-8 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200 transition-transform group-hover:scale-105">
                                                    {product.images?.[0] ? (
                                                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package className="w-6 h-6 text-slate-300" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-950 text-lg group-hover:text-premium-cyan transition-colors">{product.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-mono font-black uppercase tracking-widest mt-0.5">ID: {product.id.slice(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm">
                                                {product.category || 'Standard'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-1">
                                                <IndianRupee className="w-4 h-4 text-slate-400" />
                                                <span className="text-xl font-black text-slate-950 tabular-nums">
                                                    {product.basePrice.toLocaleString()}
                                                </span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">/sqft</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex gap-3 justify-end">
                                                <button
                                                    onClick={() => handleEditClick(product)}
                                                    className="p-2 text-slate-400 hover:text-premium-cyan hover:bg-premium-cyan/5 rounded-lg transition-all"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="p-2 text-slate-400 hover:text-error-500 hover:bg-error-50/50 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>
            )}

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-fade-in" onClick={closeModal} />
                    <GlassCard
                        className="w-full max-w-2xl relative z-10 animate-zoom-in bg-white/95 border-white shadow-2xl p-0 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
                            <div>
                                <h2 className="text-3xl font-black text-slate-950 tracking-tight">
                                    {editingId ? 'Edit Collection' : 'New Product'}
                                </h2>
                                <p className="text-sm text-slate-500 font-medium">Configure item specifications and design</p>
                            </div>
                            <button onClick={closeModal} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-100 transition-all group">
                                <X className="w-5 h-5 text-slate-500 group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>

                        <form onSubmit={handleAddOrUpdateProduct} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Product Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-slate-950 focus:outline-none focus:ring-4 focus:ring-premium-cyan/10 focus:border-premium-cyan transition-all font-bold placeholder:text-slate-300"
                                    value={newProduct.name}
                                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                    placeholder="e.g. Premium Diamond Mesh"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Category</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-slate-950 focus:outline-none focus:ring-4 focus:ring-premium-cyan/10 focus:border-premium-cyan transition-all font-bold"
                                        value={newProduct.category}
                                        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                        placeholder="e.g. Security Fencing"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Base Rate (₹ / sqft)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-slate-950 focus:outline-none focus:ring-4 focus:ring-premium-cyan/10 focus:border-premium-cyan transition-all font-bold"
                                        value={newProduct.basePrice}
                                        onChange={e => setNewProduct({ ...newProduct, basePrice: e.target.value })}
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Visual Asset URL (HD)</label>
                                <input
                                    type="url"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-slate-950 focus:outline-none focus:ring-4 focus:ring-premium-cyan/10 focus:border-premium-cyan transition-all font-bold"
                                    placeholder="https://images.unsplash.com/your-premium-image"
                                    value={newProduct.imageUrl}
                                    onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Product Description</label>
                                <textarea
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-slate-950 focus:outline-none focus:ring-4 focus:ring-premium-cyan/10 focus:border-premium-cyan transition-all font-bold min-h-[120px] resize-none"
                                    value={newProduct.description}
                                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                    placeholder="Describe the unique value proposition and specifications..."
                                ></textarea>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-4 px-6 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                                >
                                    Discard
                                </button>
                                <PremiumButton type="submit" className="flex-[2] py-4 text-slate-950 shadow-glow animate-glow-pulse">
                                    {editingId ? 'Save Improvements' : 'Finalize Catalog Entry'}
                                </PremiumButton>
                            </div>
                        </form>
                    </GlassCard>
                </div>
            )}

            <div className="absolute bottom-0 -left-20 w-80 h-80 bg-premium-cyan/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-blob"></div>
        </div>
    );
};

export default Products;
