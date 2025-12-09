import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter, Edit, Trash2, X, Image as ImageIcon, Zap, Database } from 'lucide-react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useToast } from '../common/Toast';
import LoadingSpinner from '../common/LoadingSpinner';
import { sampleProducts } from '../../data/sampleProducts';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingId, setEditingId] = useState(null); // Track which product is being edited
    const { showToast } = useToast();

    // Form State
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: '',
        basePrice: '',
        description: '',
        imageUrl: ''
    });

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
            console.error("Error fetching products:", error);
            showToast('Failed to fetch products', 'error');
        } finally {
            setLoading(false);
        }
    };

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
                // Update existing product
                await updateDoc(doc(db, 'products', editingId), {
                    ...productData,
                    updatedAt: new Date().toISOString()
                });
                showToast('Product updated successfully', 'success');
            } else {
                // Add new product
                await addDoc(collection(db, 'products'), {
                    ...productData,
                    createdAt: new Date().toISOString()
                });
                showToast('Product added successfully', 'success');
            }

            closeModal();
            fetchProducts();
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
                fetchProducts();
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

    // Extended seed data pool (8 existing + 2 new = 10 total)
    const seedDataPool = [
        ...sampleProducts,
        {
            id: 'prod-009',
            name: 'Galvanized Iron Wire',
            category: 'Wire',
            basePrice: 45,
            description: 'High-quality GI wire for binding and support applications. Rust-resistant and durable.',
            images: ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80'],
            propertyTypes: ['Agriculture', 'Construction']
        },
        {
            id: 'prod-010',
            name: 'Binding Wire',
            category: 'Accessories',
            basePrice: 30,
            description: 'Flexible binding wire for securing fence panels and posts. Easy to twist and strong.',
            images: ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80'],
            propertyTypes: ['Construction', 'Fencing']
        }
    ];

    const handleSeedData = async () => {
        if (loading) return;
        setLoading(true);
        try {
            // Shuffle and pick 5
            const shuffled = [...seedDataPool].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 5);

            const batchPromises = selected.map(product => {
                // Remove ID to let Firestore generate one, or keep it if we want custom IDs (better to let Firestore generate)
                const { id, ...data } = product;
                return addDoc(collection(db, 'products'), {
                    ...data,
                    createdAt: new Date().toISOString()
                });
            });

            await Promise.all(batchPromises);
            showToast('Added 5 seed products', 'success');
            fetchProducts();
        } catch (error) {
            console.error("Error seeding data:", error);
            showToast('Failed to add seed data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <LoadingSpinner text="Scanning Inventory..." />;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple text-glow">
                        Inventory Protocol
                    </h1>
                    <p className="text-gray-400 mt-1">Manage system resources and products</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSeedData}
                        disabled={loading}
                        className="btn bg-white/5 border border-white/10 text-neon-blue hover:bg-white/10 hover:border-neon-blue/50 flex items-center gap-2 transition-all duration-300"
                        title="Add 5 sample products"
                    >
                        <Database className="w-5 h-5" />
                        <span>Seed Data</span>
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn btn-primary flex items-center gap-2 group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        <span>Initialize Product</span>
                    </button>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-neon">
                {/* Search Bar */}
                <div className="p-6 border-b border-white/10 flex gap-4">
                    <div className="relative flex-1 max-w-md group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-500 group-focus-within:text-neon-blue transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search inventory..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input pl-10 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-neon-blue focus:shadow-neon w-full transition-all duration-300"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-neon-blue uppercase tracking-wider flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    Product Name
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-neon-purple uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-semibold text-green-400 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="group hover:bg-white/5 transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-12 h-12 rounded-lg bg-black/40 border border-white/10 overflow-hidden group-hover:border-neon-blue/50 transition-colors">
                                                    {product.images?.[0] ? (
                                                        <img
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full">
                                                            <Package className="w-6 h-6 text-gray-600" />
                                                        </div>
                                                    )}
                                                    {/* Glow effect on image */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-neon-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                </div>
                                                <div>
                                                    <span className="font-bold text-white group-hover:text-neon-blue transition-colors block">{product.name}</span>
                                                    <span className="text-xs text-gray-500 font-mono">ID: {product.id.slice(0, 8)}...</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-neon-purple border border-neon-purple/20">
                                                {product.category || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-green-400 text-lg">
                                            ₹{product.basePrice}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => handleEditClick(product)}
                                                    className="p-2 text-gray-400 hover:text-neon-blue hover:bg-neon-blue/10 rounded-lg transition-all duration-300 group/btn"
                                                    title="Edit Product"
                                                >
                                                    <Edit className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-300 group/btn"
                                                    title="Delete Product"
                                                >
                                                    <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <Search className="w-12 h-12 mb-4 text-gray-600 opacity-50" />
                                            <p className="text-lg">No inventory items found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="glass-panel w-full max-w-md rounded-2xl border border-neon-blue/30 shadow-neon overflow-hidden animate-slide-in">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                {editingId ? <Edit className="w-5 h-5 text-neon-blue" /> : <Plus className="w-5 h-5 text-neon-blue" />}
                                {editingId ? 'Edit Product' : 'New Product Entry'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-white hover:rotate-90 transition-all duration-300"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleAddOrUpdateProduct} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Product Designation</label>
                                <input
                                    type="text"
                                    required
                                    className="input w-full bg-black/20 border-white/10 focus:border-neon-blue focus:shadow-neon text-white placeholder-gray-600"
                                    value={newProduct.name}
                                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                    placeholder="Enter product name"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Category</label>
                                    <input
                                        type="text"
                                        className="input w-full bg-black/20 border-white/10 focus:border-neon-purple focus:shadow-neon-purple text-white placeholder-gray-600"
                                        value={newProduct.category}
                                        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                        placeholder="Category"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Base Price (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        className="input w-full bg-black/20 border-white/10 focus:border-green-400 focus:shadow-[0_0_10px_rgba(74,222,128,0.3)] text-white placeholder-gray-600"
                                        value={newProduct.basePrice}
                                        onChange={e => setNewProduct({ ...newProduct, basePrice: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Image URL</label>
                                <div className="relative group">
                                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-blue transition-colors w-4 h-4" />
                                    <input
                                        type="url"
                                        className="input pl-10 w-full bg-black/20 border-white/10 focus:border-neon-blue text-white placeholder-gray-600"
                                        placeholder="https://..."
                                        value={newProduct.imageUrl}
                                        onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-3 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 hover:text-white transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 btn btn-primary flex items-center justify-center gap-2 group"
                                >
                                    <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    {editingId ? 'Update Product' : 'Save to Database'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
