import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.jpg';
import { LogOut, Package, FolderKanban, Calculator, User, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../common/Toast';

const CustomerLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, logout } = useAuth();
    const { showToast } = useToast();

    const tabs = [
        { name: 'Products', path: '/customer/dashboard', icon: Package },
        { name: 'My Projects', path: '/customer/projects', icon: FolderKanban },
        { name: 'Calculator', path: '/customer/calculator', icon: Calculator },
        { name: 'My Quotes', path: '/customer/quotes', icon: FileText },
        { name: 'Profile', path: '/customer/profile', icon: User },
    ];

    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            showToast('Logged out successfully', 'success');
            navigate('/signin');
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-transparent text-gray-100">
            {/* Header */}
            <header className="fixed top-4 left-4 right-4 z-50">
                <div className="max-w-7xl mx-auto">
                    <div className="glass-panel rounded-2xl px-6 py-3 flex justify-between items-center animate-slide-in">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neon-blue to-neon-purple p-[2px] shadow-neon overflow-hidden">
                                <img src={logo} alt="Logo" className="w-full h-full object-cover rounded-full" />
                            </div>
                            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple text-glow">
                                Athanuramman Fencing
                            </h1>
                        </div>

                        {/* Navigation Tabs */}
                        <nav className="hidden md:flex items-center gap-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const active = isActive(tab.path);
                                return (
                                    <button
                                        key={tab.path}
                                        onClick={() => navigate(tab.path)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${active
                                            ? 'bg-neon-blue/10 text-neon-blue shadow-neon border border-neon-blue/30'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <Icon className={`w-4 h-4 ${active ? 'animate-bounce' : ''}`} />
                                        {tab.name}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* User Info & Logout */}
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-white">{currentUser?.displayName}</p>
                                <p className="text-xs text-gray-400">{currentUser?.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300 hover:shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Bottom Bar */}
            <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
                <div className="glass-panel rounded-2xl p-2 flex justify-around">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const active = isActive(tab.path);
                        return (
                            <button
                                key={tab.path}
                                onClick={() => navigate(tab.path)}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${active
                                    ? 'text-neon-blue bg-neon-blue/10 shadow-neon'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${active ? 'animate-bounce' : ''}`} />
                                <span className="text-[10px] mt-1">{tab.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 md:pb-8">
                <div className="animate-fade-in text-gray-100">
                    <Outlet />
                </div>
            </main>

            {/* Footer */}
            <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-400 text-sm animate-fade-in delay-500">
                <p>&copy; {new Date().getFullYear()} Athanuramman Fencings. All rights reserved.</p>
                <div className="mt-2">
                    <button
                        onClick={() => navigate('/terms')}
                        className="text-gray-500 hover:text-neon-blue transition-colors underline decoration-dotted underline-offset-4"
                    >
                        Terms & Conditions
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default CustomerLayout;
