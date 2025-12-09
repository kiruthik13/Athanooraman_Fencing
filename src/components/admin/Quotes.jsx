import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, Filter, Eye, Check, X, Pencil, Trash2, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useToast } from '../common/Toast';
import LoadingSpinner from '../common/LoadingSpinner';

const Quotes = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { showToast } = useToast();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentQuoteId, setCurrentQuoteId] = useState(null);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        amount: '',
        status: 'Pending',
        description: ''
    });

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'quotes'));
            const quotesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Sort by date descending (newest first)
            quotesData.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
                const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
                return dateB - dateA;
            });
            setQuotes(quotesData);
        } catch (error) {
            console.error("Error fetching quotes:", error);
            showToast('Failed to fetch quotes', 'error');
        } finally {
            setLoading(false);
        }
    };

    // --- CRUD Operations ---

    // 1. CREATE & UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const quoteData = {
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                amount: Number(formData.amount),
                totalCost: Number(formData.amount), // Normalize field name
                status: formData.status,
                description: formData.description,
                updatedAt: new Date().toISOString()
            };

            if (isEditing) {
                // Update
                await updateDoc(doc(db, 'quotes', currentQuoteId), quoteData);
                showToast('Quote updated successfully', 'success');
            } else {
                // Create
                quoteData.createdAt = new Date().toISOString();
                await addDoc(collection(db, 'quotes'), quoteData);
                showToast('Quote created successfully', 'success');
            }
            closeModal();
            fetchQuotes();
        } catch (error) {
            console.error("Error saving quote:", error);
            showToast('Failed to save quote', 'error');
        } finally {
            setLoading(false);
        }
    };

    // 2. DELETE
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this quote? This action cannot be undone.')) {
            return;
        }
        try {
            await deleteDoc(doc(db, 'quotes', id));
            showToast('Quote deleted successfully', 'success');
            fetchQuotes(); // Refresh list
        } catch (error) {
            console.error("Error deleting quote:", error);
            showToast('Failed to delete quote', 'error');
        }
    };

    // 3. UPDATE STATUS (Quick Action)
    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await updateDoc(doc(db, 'quotes', id), {
                status: newStatus,
                updatedAt: new Date().toISOString()
            });
            showToast(`Quote ${newStatus} successfully`, 'success');
            fetchQuotes();
        } catch (error) {
            console.error("Error updating quote status:", error);
            showToast('Failed to update status', 'error');
        }
    };

    // --- Modal Handlers ---
    const openCreateModal = () => {
        setFormData({
            customerName: '',
            customerEmail: '',
            amount: '',
            status: 'Pending',
            description: ''
        });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (quote) => {
        setFormData({
            customerName: quote.customerName || quote.customer || '',
            customerEmail: quote.customerEmail || '',
            amount: quote.totalCost || quote.amount || '',
            status: quote.status || 'Pending',
            description: quote.description || ''
        });
        setCurrentQuoteId(quote.id);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ customerName: '', customerEmail: '', amount: '', status: 'Pending', description: '' });
    };


    const filteredQuotes = quotes.filter(quote =>
        quote.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_15px_rgba(74,222,128,0.3)]';
            case 'Completed': return 'bg-neon-blue/10 text-neon-blue border-neon-blue/20 shadow-[0_0_15px_rgba(0,243,255,0.3)]';
            case 'In Progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(96,165,250,0.3)]';
            case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(248,113,113,0.3)]';
            default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_15px_rgba(250,204,21,0.3)]';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved': return <CheckCircle className="w-3 h-3 mr-1" />;
            case 'Completed': return <CheckCircle className="w-3 h-3 mr-1" />;
            case 'Rejected': return <AlertCircle className="w-3 h-3 mr-1" />;
            default: return <Clock className="w-3 h-3 mr-1" />;
        }
    };

    if (loading && !isModalOpen) return <LoadingSpinner text="Retrieving Quotes..." />;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple text-glow">
                        Quotes & Proposals
                    </h1>
                    <p className="text-gray-400 mt-1">Manage customer requests and estimations</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="btn btn-primary flex items-center gap-2 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Create Proposal</span>
                </button>
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
                            placeholder="Search quotes by ID or customer..."
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
                                <th className="px-6 py-4 text-xs font-semibold text-neon-blue uppercase tracking-wider">Client Details</th>
                                <th className="px-6 py-4 text-xs font-semibold text-neon-purple uppercase tracking-wider">Date Issued</th>
                                <th className="px-6 py-4 text-xs font-semibold text-green-400 uppercase tracking-wider">Total Value</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredQuotes.length > 0 ? (
                                filteredQuotes.map((quote) => (
                                    <tr key={quote.id} className="group hover:bg-white/5 transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <div>
                                                <span className="font-bold text-white group-hover:text-neon-blue transition-colors block">
                                                    {quote.customerName || quote.customer || 'Unknown User'}
                                                </span>
                                                <span className="text-xs text-gray-500 font-mono">ID: {quote.id.slice(0, 8)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-green-400 text-lg">
                                            ₹{(quote.totalCost || quote.amount || 0).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(quote.status)}`}>
                                                {getStatusIcon(quote.status)}
                                                {quote.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {/* Edit Button */}
                                                <button
                                                    onClick={() => openEditModal(quote)}
                                                    className="p-2 text-neon-blue hover:bg-neon-blue/10 rounded-lg transition-colors group/edit"
                                                    title="Edit Quote"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDelete(quote.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors group/del"
                                                    title="Delete Quote"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>

                                                {/* Quick Approve/Reject (Only for Pending) */}
                                                {quote.status === 'Pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateStatus(quote.id, 'Approved')}
                                                            title="Approve"
                                                            className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors hover:scale-110"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(quote.id, 'Rejected')}
                                                            title="Reject"
                                                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors hover:scale-110"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <FileText className="w-12 h-12 mb-4 mx-auto opacity-50" />
                                        <p className="text-lg">No quotes found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Create/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="glass-panel w-full max-w-lg rounded-2xl border border-neon-blue/30 shadow-neon overflow-hidden animate-slide-in">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h2 className="text-xl font-bold text-white">
                                {isEditing ? 'Modify Proposal' : 'New Quote Proposal'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-white hover:rotate-90 transition-all duration-300">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Customer Name</label>
                                <input
                                    type="text"
                                    value={formData.customerName}
                                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    className="input w-full bg-black/20 border-white/10 focus:border-neon-blue focus:shadow-neon text-white placeholder-gray-600"
                                    required
                                    placeholder="Enter customer name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Amount (INR)</label>
                                <input
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="input w-full bg-black/20 border-white/10 focus:border-green-400 focus:shadow-[0_0_10px_rgba(74,222,128,0.3)] text-white placeholder-gray-600"
                                    required
                                    placeholder="0.00"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="input w-full bg-black/20 border-white/10 focus:border-neon-purple focus:shadow-neon-purple text-white appearance-none"
                                >
                                    <option value="Pending" className="bg-gray-900">Pending</option>
                                    <option value="Approved" className="bg-gray-900">Approved</option>
                                    <option value="Rejected" className="bg-gray-900">Rejected</option>
                                    <option value="Completed" className="bg-gray-900">Completed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Notes / Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input w-full h-24 resize-none bg-black/20 border-white/10 focus:border-neon-blue focus:shadow-neon text-white placeholder-gray-600"
                                    placeholder="Optional notes..."
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
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
                                    <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    {isEditing ? 'Update Quote' : 'Create Quote'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quotes;
