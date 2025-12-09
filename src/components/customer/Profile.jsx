import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';
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
                    setUserData(userDoc.data());
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
                fullName: userData.fullName,
                phone: userData.phone,
                location: userData.location
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
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
                <p className="text-gray-600 mt-1">Manage your account information</p>
            </div>

            <div className="max-w-2xl">
                <div className="card">
                    {/* Profile Header */}
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="w-10 h-10 text-primary-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{userData.fullName}</h3>
                            <p className="text-gray-600">{userData.email}</p>
                            <span className="badge badge-info mt-2">{userData.role}</span>
                        </div>
                    </div>

                    {/* Profile Form */}
                    <div className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="fullName"
                                    value={userData.fullName}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="input pl-10 disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>
                        </div>

                        {/* Email (Read-only) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    value={userData.email}
                                    disabled
                                    className="input pl-10 bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="phone"
                                    value={userData.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="input pl-10 disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    name="location"
                                    value={userData.location}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="input pl-10 disabled:bg-gray-50 disabled:text-gray-500"
                                >
                                    <option value="Bangalore">Bangalore</option>
                                    <option value="Hyderabad">Hyderabad</option>
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Chennai">Chennai</option>
                                    <option value="Coimbatore">Coimbatore</option>
                                    <option value="Madurai">Madurai</option>
                                </select>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn btn-primary flex-1"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="btn btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            fetchUserData();
                                        }}
                                        className="btn btn-outline flex-1"
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Account Info */}
                <div className="card mt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Account Information</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Account Created</span>
                            <span className="font-medium text-gray-900">
                                {new Date(userData.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Last Login</span>
                            <span className="font-medium text-gray-900">
                                {new Date(userData.lastLogin).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Account Type</span>
                            <span className="font-medium text-gray-900">{userData.role}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
