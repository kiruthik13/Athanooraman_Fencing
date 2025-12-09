import React, { useState } from 'react';
import { X, IndianRupee, Clock, Package, CheckCircle, Loader } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../common/Toast';

const ProductDetail = ({ product, onClose }) => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const handleRequestQuote = async () => {
        if (!currentUser) {
            showToast('Please sign in to request a quote', 'error');
            return;
        }

        setSubmitting(true);
        try {
            const quoteData = {
                customerId: currentUser.uid,
                customerName: currentUser.displayName || currentUser.email || 'Customer',
                customerEmail: currentUser.email,
                productId: product.id,
                productName: product.name,
                amount: Number(product.basePrice) || 0, // Initial estimate based on base price
                totalCost: Number(product.basePrice) || 0,
                status: 'Pending',
                createdAt: new Date().toISOString(),
                type: 'Product Inquiry'
            };

            await addDoc(collection(db, 'quotes'), quoteData);
            showToast('Quote request submitted successfully!', 'success');
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            console.error("Error creating quote:", error);
            showToast('Failed to submit quote request', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-space-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-neon-blue/20">
                {/* Header */}
                <div className="sticky top-0 bg-space-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center z-10">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple text-glow">{product.name}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative h-96 bg-space-black/50 rounded-xl overflow-hidden border border-white/5">
                            <img
                                src={product.images?.[currentImageIndex] || 'https://via.placeholder.com/800x600'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {product.images?.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neon-blue/20 scrollbar-track-transparent">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${currentImageIndex === index ? 'border-neon-blue shadow-neon scale-105' : 'border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Price & Category */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple text-glow">
                            <IndianRupee className="w-8 h-8 text-neon-blue" />
                            {product.basePrice}
                            <span className="text-lg text-gray-400 font-normal">/sq ft</span>
                        </div>
                        <span className="badge badge-info text-base shadow-neon">{product.category}</span>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            <span className="w-1 h-6 bg-neon-blue rounded-full shadow-neon"></span>
                            Description
                        </h3>
                        <p className="text-gray-300 leading-relaxed pl-3">{product.description}</p>
                    </div>

                    {/* Specifications */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                            <span className="w-1 h-6 bg-neon-purple rounded-full shadow-neon-purple"></span>
                            Specifications
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(product.specifications || {}).map(([key, value]) => (
                                <div key={key} className="bg-white/5 border border-white/10 p-4 rounded-xl hover:border-neon-blue/30 transition-colors">
                                    <p className="text-sm text-neon-blue capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                    <p className="text-base font-medium text-white">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Installation Time */}
                    <div className="flex items-center gap-3 text-gray-300 bg-white/5 p-4 rounded-xl border border-white/10">
                        <Clock className="w-6 h-6 text-neon-purple animate-pulse" />
                        <span className="font-medium text-white">Installation Time:</span>
                        <span>{product.installationTime}</span>
                    </div>

                    {/* Property Types */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-3">Suitable Property Types</h3>
                        <div className="flex flex-wrap gap-2">
                            {product.propertyTypes?.map((type, index) => (
                                <span key={index} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm">
                                    {type}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Features */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-3">Key Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {product.features?.map((feature, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                    </div>
                                    <span className="text-gray-300">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Request Quote Button */}
                    <div className="pt-6 border-t border-white/10">
                        <button
                            onClick={handleRequestQuote}
                            disabled={submitting}
                            className="w-full btn btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 translate-x-[-100%] group-hover:translate-x-100 transition-transform duration-1000"></div>
                            {submitting ? (
                                <>
                                    <Loader className="w-6 h-6 animate-spin" />
                                    <span className="text-glow">Submitting Request...</span>
                                </>
                            ) : (
                                <>
                                    <Package className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                                    <span className="text-glow">Request Quote</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
