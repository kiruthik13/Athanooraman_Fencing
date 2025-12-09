import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Mail, Phone, Calendar, User, Shield } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useToast } from '../common/Toast';
import LoadingSpinner from '../common/LoadingSpinner';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const usersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            const customerList = usersData.filter(user => user.role === 'Customer');
            setCustomers(customerList);
        } catch (error) {
            console.error("Error fetching customers:", error);
            showToast('Failed to fetch customers', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(customer =>
        customer.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <LoadingSpinner text="Loading client database..." />;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple text-glow">
                        Client Database
                    </h1>
                    <p className="text-gray-400 mt-1">Manage customer profiles and access</p>
                </div>
                <button
                    disabled
                    className="btn btn-primary flex items-center gap-2 group opacity-50 cursor-not-allowed"
                >
                    <User className="w-5 h-5" />
                    <span>Add Customer</span>
                </button>
            </div>

            {/* Main Content Card */}
            <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-neon">
                {/* Search Bar */}
                <div className="p-6 border-b border-white/10 flex gap-4">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-blue transition-colors w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search customers by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input pl-10 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-neon-blue focus:shadow-neon w-full transition-all duration-300"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-neon-blue uppercase tracking-wider">Customer Profile</th>
                                <th className="px-6 py-4 text-xs font-semibold text-neon-purple uppercase tracking-wider">Contact Info</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Access Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Joined Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="group hover:bg-white/5 transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-white/10 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                                                    {customer.displayName?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-white group-hover:text-neon-blue transition-colors block">{customer.displayName}</span>
                                                    <span className="text-xs text-gray-500 font-mono">ID: {customer.id.slice(0, 8)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                                    <Mail className="w-3 h-3 text-gray-500" />
                                                    {customer.email}
                                                </div>
                                                {customer.phoneNumber && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                                        <Phone className="w-3 h-3 text-gray-500" />
                                                        {customer.phoneNumber}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
                                                <Shield className="w-3 h-3" />
                                                {customer.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3 h-3" />
                                                {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        <Users className="w-12 h-12 mb-4 mx-auto opacity-50" />
                                        <p className="text-lg">No customers found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Customers;
