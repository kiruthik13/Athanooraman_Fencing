import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, MapPin, Save, Shield, Calendar, Clock, Edit2 } from 'lucide-react';
import { useToast } from '../common/Toast';
import LoadingSpinner from '../common/LoadingSpinner';

const Profile = () => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        fullName: '',
        email: '',
        phone: '',
        location: ''
    });

    useEffect(() => {
        fetchUserData();
    }, [currentUser]);

    const fetchUserData = async () => {
        try {
            if (currentUser) {
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUserData({
                        ...data,
                        fullName: data.fullName || '',
                        email: data.email || currentUser.email || '',
                        phone: data.phone || '',
                        location: data.location || ''
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateDoc(doc(db, 'users', currentUser.uid), {
                fullName: userData.fullName || '',
                phone: userData.phone || '',
                location: userData.location || '',
                updatedAt: new Date().toISOString()
            });
            showToast('Profile updated successfully!', 'success');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            showToast('Failed to update profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <LoadingSpinner text="Loading profile..." />;
    }

    return (
        <div className="animate-fade-in max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple text-glow">
                        My Profile
                    </h2>
                    <p className="text-gray-400 mt-1">Manage your account information</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="btn btn-primary flex items-center gap-2 group"
                    >
                        <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>Edit Profile</span>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Avatar & Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue to-neon-purple"></div>
                        <div className="w-24 h-24 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-full flex items-center justify-center mb-4 border border-white/10 shadow-neon">
                            <User className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{userData.fullName || 'User'}</h3>
                        <p className="text-gray-400 text-sm mb-4">{userData.email}</p>
                        <span className="px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-xs font-semibold uppercase tracking-wider">
                            {userData.role}
                        </span>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border border-white/10">
                        <h4 className="flex items-center gap-2 text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">
                            <Shield className="w-4 h-4" /> Account Details
                        </h4>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                                <span className="text-gray-500 ">Joined</span>
                                <span className="text-gray-300">
                                    {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                                <span className="text-gray-500">Last Login</span>
                                <span className="text-gray-300">
                                    {userData.lastLogin ? new Date(userData.lastLogin).toLocaleDateString() : 'Today'}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Status</span>
                                <span className="text-green-400 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Edit Form */}
                <div className="lg:col-span-2">
                    <div className="glass-panel p-8 rounded-2xl border border-white/10 relative">
                        {isEditing && (
                            <div className="absolute top-0 left-0 w-full h-full bg-neon-blue/5 pointer-events-none animate-pulse-slow"></div>
                        )}

                        <div className="space-y-6 relative z-10">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <User className="w-5 h-5 text-neon-blue" />
                                Personal Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Full Name */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-3 text-gray-500 group-focus-within:text-neon-blue transition-colors w-5 h-5" />
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={userData.fullName}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="input pl-10 w-full bg-black/20 border-white/10 text-white placeholder-gray-600 focus:border-neon-blue disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                                        <input
                                            type="email"
                                            value={userData.email}
                                            disabled
                                            className="input pl-10 w-full bg-white/5 border-white/5 text-gray-400 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 ml-1">Phone Number</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-3 top-3 text-gray-500 group-focus-within:text-neon-blue transition-colors w-5 h-5" />
                                        <input
                                            type="text"
                                            name="phone"
                                            value={userData.phone}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="input pl-10 w-full bg-black/20 border-white/10 text-white placeholder-gray-600 focus:border-neon-blue disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 ml-1">Location</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-3 top-3 text-gray-500 group-focus-within:text-neon-blue transition-colors w-5 h-5" />
                                        <input
                                            type="text"
                                            list="locations"
                                            name="location"
                                            value={userData.location}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="input pl-10 w-full bg-black/20 border-white/10 text-white focus:border-neon-blue disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="Select or type your location"
                                        />
                                        <datalist id="locations">
                                            <option value="Coimbatore" />
                                            <option value="Erode" />
                                            <option value="Tirupur" />
                                            <option value="Chennai" />
                                            <option value="Madurai" />
                                            <option value="Bangalore" />
                                            <option value="Hyderabad" />
                                            <option value="Mumbai" />
                                        </datalist>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {isEditing && (
                                <div className="flex gap-4 pt-6 border-t border-white/10 mt-6 animate-fade-in">
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            fetchUserData();
                                        }}
                                        className="btn bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 flex-1 py-2.5 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="btn btn-primary flex-1 py-2.5 flex items-center justify-center gap-2"
                                    >
                                        {saving ? (
                                            <>
                                                <LoadingSpinner size="sm" />
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                <span>Save Changes</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
