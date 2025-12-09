import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Calculator as CalcIcon, IndianRupee, FileText } from 'lucide-react';
import { useToast } from '../common/Toast';
import { useAuth } from '../../contexts/AuthContext';
import BillGenerator from './BillGenerator';

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
    const [showBill, setShowBill] = useState(false);

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
            showToast('Please fill in all fields', 'warning');
            return;
        }

        const product = products.find(p => p.id === productId);
        if (!product) return;

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
    };

    const handleGenerateQuote = async () => {
        if (!calculations) {
            showToast('Please calculate costs first', 'warning');
            return;
        }

        setIsSubmitting(true);
        try {
            const quoteData = {
                customerName: userProfile?.fullName || currentUser?.displayName || 'Guest User',
                customerEmail: currentUser?.email || 'guest@example.com',
                customerId: currentUser?.uid || null,
                // Main fields expected by Quotes page
                totalCost: parseFloat(calculations.grandTotal),
                amount: parseFloat(calculations.grandTotal),
                status: 'Pending', // Capitalized to match existing quotes
                // Additional project details
                projectDetails: {
                    length: formData.length,
                    width: formData.width,
                    height: formData.height,
                    area: calculations.area
                },
                product: {
                    id: calculations.productId,
                    name: calculations.productName
                },
                costBreakdown: {
                    materialCost: parseFloat(calculations.materialCost),
                    laborCost: parseFloat(calculations.laborCost),
                    transportCost: parseFloat(calculations.transportCost),
                    grandTotal: parseFloat(calculations.grandTotal)
                },
                description: `Fencing project: ${calculations.productName} - ${calculations.area} sq ft`,
                isRead: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            await addDoc(collection(db, 'quotes'), quoteData);
            showToast('Quote request sent successfully! Our team will contact you soon.', 'success');

            // Reset form
            setFormData({
                length: '',
                width: '',
                height: '',
                productId: products[0]?.id || ''
            });
            setCalculations(null);
        } catch (error) {
            console.error('Error generating quote:', error);
            showToast('Failed to send quote request. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Fencing Calculator</h2>
                <p className="text-gray-600 mt-1">Calculate estimated costs for your fencing project</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Form */}
                <div className="card">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CalcIcon className="w-5 h-5 text-primary-600" />
                        Project Details
                    </h3>

                    <div className="space-y-4">
                        {/* Fence Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fence Type
                            </label>
                            <select
                                name="productId"
                                value={formData.productId}
                                onChange={handleChange}
                                className="input"
                            >
                                {products.map(product => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} - ₹{product.basePrice}/sq ft
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Property Length */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Property Length (ft)
                            </label>
                            <input
                                type="number"
                                name="length"
                                value={formData.length}
                                onChange={handleChange}
                                className="input"
                                placeholder="Enter length in feet"
                                min="1"
                            />
                        </div>

                        {/* Property Width */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Property Width (ft)
                            </label>
                            <input
                                type="number"
                                name="width"
                                value={formData.width}
                                onChange={handleChange}
                                className="input"
                                placeholder="Enter width in feet"
                                min="1"
                            />
                        </div>

                        {/* Fence Height */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fence Height (ft)
                            </label>
                            <input
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                className="input"
                                placeholder="Enter height in feet"
                                min="1"
                            />
                        </div>

                        {/* Calculate Button */}
                        <button
                            onClick={calculateCosts}
                            className="w-full btn btn-primary py-3"
                        >
                            Calculate Costs
                        </button>
                    </div>
                </div>

                {/* Results */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neon-blue/10 via-neon-purple/10 to-neon-blue/5 border border-white/20 backdrop-blur-xl p-6">
                    {/* Animated background orbs */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-neon-purple/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                    <div className="relative z-10">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="text-gradient">Cost Estimate</span>
                            <div className="h-px flex-1 bg-gradient-to-r from-neon-blue/50 to-transparent"></div>
                        </h3>

                        {calculations ? (
                            <div className="space-y-4">
                                {/* Total Area - Hero Card */}
                                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30 p-6 group hover:scale-[1.02] transition-transform duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative z-10">
                                        <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Total Fencing Area</p>
                                        <p className="text-4xl font-bold text-white mb-1">{calculations.area}</p>
                                        <p className="text-neon-blue text-sm font-medium">square feet</p>
                                    </div>
                                </div>

                                {/* Product Selection Card */}
                                <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 p-5 backdrop-blur-sm hover:border-neon-purple/30 transition-all duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 flex items-center justify-center border border-neon-purple/30">
                                            <CalcIcon className="w-6 h-6 text-neon-purple" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider">Selected Product</p>
                                            <p className="text-lg font-bold text-white">{calculations.productName}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Cost Breakdown - Premium Cards */}
                                <div className="space-y-3">
                                    <p className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Cost Breakdown</p>

                                    {/* Material Cost */}
                                    <div className="relative overflow-hidden rounded-lg bg-white/5 border border-white/10 p-4 group hover:bg-white/10 hover:border-neon-blue/30 transition-all duration-300">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-300 font-medium">Material Cost</span>
                                            <span className="text-xl font-bold text-white flex items-center gap-1">
                                                <IndianRupee className="w-5 h-5 text-neon-blue" />
                                                {calculations.materialCost}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-neon-blue to-transparent w-0 group-hover:w-full transition-all duration-500"></div>
                                    </div>

                                    {/* Labor Cost */}
                                    <div className="relative overflow-hidden rounded-lg bg-white/5 border border-white/10 p-4 group hover:bg-white/10 hover:border-neon-purple/30 transition-all duration-300">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-300 font-medium">Labor Cost</span>
                                            <span className="text-xl font-bold text-white flex items-center gap-1">
                                                <IndianRupee className="w-5 h-5 text-neon-purple" />
                                                {calculations.laborCost}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-neon-purple to-transparent w-0 group-hover:w-full transition-all duration-500"></div>
                                    </div>

                                    {/* Transportation */}
                                    <div className="relative overflow-hidden rounded-lg bg-white/5 border border-white/10 p-4 group hover:bg-white/10 hover:border-neon-blue/30 transition-all duration-300">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-300 font-medium">Transportation</span>
                                            <span className="text-xl font-bold text-white flex items-center gap-1">
                                                <IndianRupee className="w-5 h-5 text-neon-blue" />
                                                {calculations.transportCost}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-neon-blue to-transparent w-0 group-hover:w-full transition-all duration-500"></div>
                                    </div>
                                </div>

                                {/* Grand Total - Premium Highlight */}
                                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-neon-blue/30 via-neon-purple/30 to-neon-blue/20 border-2 border-neon-blue/50 p-6 mt-6 shadow-[0_0_30px_rgba(0,243,255,0.3)]">
                                    <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 animate-pulse"></div>
                                    <div className="relative z-10 flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-300 uppercase tracking-wider mb-1">Grand Total</p>
                                            <p className="text-xs text-neon-blue">Estimated Project Cost</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-2">
                                                <IndianRupee className="w-8 h-8 text-neon-blue" />
                                                <span className="text-4xl font-bold text-white text-glow">{calculations.grandTotal}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                                    {/* Generate Quote Button */}
                                    <button
                                        onClick={handleGenerateQuote}
                                        disabled={isSubmitting}
                                        className="btn btn-secondary py-4 text-lg font-semibold shadow-[0_0_20px_rgba(189,0,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Sending Request...' : 'Generate Quote Request'}
                                    </button>

                                    {/* Generate Bill Button */}
                                    <button
                                        onClick={() => setShowBill(true)}
                                        className="btn btn-primary py-4 text-lg font-semibold shadow-[0_0_20px_rgba(0,243,255,0.3)] flex items-center justify-center gap-2"
                                    >
                                        <FileText className="w-5 h-5" />
                                        Generate Bill
                                    </button>
                                </div>

                                <p className="text-xs text-gray-400 text-center mt-4 italic">
                                    * This is an estimated cost. Final quote may vary based on site conditions.
                                </p>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="relative inline-block">
                                    <div className="absolute inset-0 bg-neon-blue/20 blur-2xl animate-pulse"></div>
                                    <CalcIcon className="relative w-20 h-20 text-neon-blue/50 mx-auto mb-4" />
                                </div>
                                <p className="text-gray-400 text-lg">Enter project details and click calculate</p>
                                <p className="text-gray-500 text-sm mt-2">to see your premium cost estimate</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bill Generator Modal */}
            {showBill && calculations && (
                <BillGenerator
                    calculations={calculations}
                    formData={formData}
                    product={{ name: calculations.productName }}
                    customerInfo={{
                        name: userProfile?.fullName || currentUser?.displayName || 'Guest User',
                        email: currentUser?.email || 'guest@example.com'
                    }}
                    onClose={() => setShowBill(false)}
                />
            )}
        </div>
    );
};

export default Calculator;
