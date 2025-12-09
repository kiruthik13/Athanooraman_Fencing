import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Eye, IndianRupee } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import ProductDetail from './ProductDetail';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);

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
        return <LoadingSpinner text="Loading products..." />;
    }

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Our Products</h2>
                <p className="text-gray-600 mt-1">Browse our complete range of fencing solutions</p>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-12 glass-panel rounded-xl">
                    <p className="text-gray-400">No products available in this sector.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            className="card group animate-slide-in relative overflow-hidden"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Hover Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            {/* Product Image */}
                            <div className="relative h-52 bg-space-black/50 rounded-lg overflow-hidden mb-4 border border-white/5 group-hover:border-neon-blue/30 transition-all duration-300">
                                <img
                                    src={product.images?.[0] || 'https://via.placeholder.com/400x300'}
                                    alt={product.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-space-black/80 to-transparent"></div>
                                <div className="absolute top-2 right-2">
                                    <span className="badge badge-info shadow-neon backdrop-blur-md">{product.category}</span>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="space-y-4 relative z-10">
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neon-blue group-hover:to-neon-purple transition-all duration-300">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>

                                {/* Price */}
                                <div className="flex items-center gap-1 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple text-glow">
                                    <IndianRupee className="w-6 h-6 text-neon-blue" />
                                    {product.basePrice}
                                    <span className="text-sm text-gray-500 font-normal self-end mb-1">/sq ft</span>
                                </div>

                                {/* Features Preview */}
                                <div className="flex flex-wrap gap-2">
                                    {product.features?.slice(0, 2).map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10">
                                            <div className="w-1.5 h-1.5 rounded-full bg-neon-purple shadow-[0_0_5px_#bd00ff]"></div>
                                            <span className="text-xs text-gray-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* View Details Button */}
                                <button
                                    onClick={() => setSelectedProduct(product)}
                                    className="w-full btn btn-primary flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(0,243,255,0.4)]"
                                >
                                    <Eye className="w-4 h-4" />
                                    View Specifications
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Product Detail Modal */}
            {selectedProduct && (
                <ProductDetail
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
};

export default Products;
