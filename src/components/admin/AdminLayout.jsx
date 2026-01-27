import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.jpg';
import {
    LayoutDashboard,
    Package,
    FileText,
    FolderKanban,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    User,
    Sparkles,
    ChevronRight,
    Search
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../common/Toast';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, logout } = useAuth();
    const { showToast } = useToast();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [unreadQuoteCount, setUnreadQuoteCount] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef(null);

    const menuItems = [
        { name: 'Console', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Catalog', path: '/admin/products', icon: Package },
        { name: 'Proposals', path: '/admin/quotes', icon: FileText, badge: unreadQuoteCount },
        { name: 'Execution', path: '/admin/projects', icon: FolderKanban },
        { name: 'Network', path: '/admin/customers', icon: Users },
        { name: 'Intelligence', path: '/admin/reports', icon: BarChart3 },
        { name: 'Operations', path: '/admin/settings', icon: Settings },
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Fetch unread quote count
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const q = query(collection(db, 'quotes'), where('isRead', '==', false));
                const querySnapshot = await getDocs(q);
                setUnreadQuoteCount(querySnapshot.size);
            } catch (error) {
                console.error('Error fetching unread quotes:', error);
            }
        };

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            showToast('Secure session terminated', 'success');
            navigate('/admin-login');
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            showToast(`Searching architecture for: ${searchQuery}`, 'neutral');
            // In a real app, this might navigate to a results page or filter the current view
            // For now, we'll demonstrate functionality with a toast
        }
    };

    const handleFooterLink = (link) => {
        showToast(`${link} module is currently under architectural encryption`, 'neutral');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-[#FDFDFF] flex font-sans selection:bg-premium-purple/20 selection:text-premium-purple">
            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 h-screen z-50
                w-72 bg-slate-950 text-white
                transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                border-r border-white/5 shadow-2xl
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Sidebar Glass Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-premium-purple/10 to-transparent pointer-events-none" />

                {/* Sidebar Header */}
                <div className="p-8 pb-10 relative">
                    <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/admin/dashboard')}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-premium-cyan rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity" />
                            <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-white/20 shadow-2xl transform group-hover:rotate-6 transition-transform">
                                <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="text-left">
                            <h1 className="text-xl font-black tracking-tight text-white group-hover:text-premium-cyan transition-colors">Athanuramman Fencing</h1>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Elite Command</p>
                            </div>
                        </div>
                    </div>
                    {/* Mobile close button */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden absolute top-10 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all active:scale-90"
                    >
                        <X className="w-5 h-5 text-slate-300" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <button
                                key={item.path}
                                onClick={() => {
                                    navigate(item.path);
                                    setSidebarOpen(false);
                                }}
                                className={`
                                    relative group w-full flex items-center gap-4 px-5 py-4 rounded-2xl 
                                    transition-all duration-300 font-bold overflow-hidden
                                    ${active
                                        ? 'bg-gradient-to-r from-premium-purple/20 to-transparent text-white border-l-4 border-premium-purple'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'}
                                `}
                            >
                                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${active ? 'text-premium-purple' : 'text-slate-500 group-hover:text-slate-200'}`} />
                                <span className="flex-1 text-left text-sm tracking-wide">{item.name}</span>
                                {item.badge > 0 && (
                                    <span className="px-2 py-0.5 text-[10px] font-black bg-premium-cyan text-slate-950 rounded-full shadow-glow-sm animate-glow-pulse">
                                        {item.badge}
                                    </span>
                                )}
                                {active && (
                                    <ChevronRight className="w-4 h-4 text-premium-purple animate-pulse" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-6">
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-error-500/10 rounded-full blur-2xl group-hover:bg-error-500/20 transition-all"></div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 text-slate-400 hover:text-error-400 transition-all font-black uppercase tracking-widest text-[10px]"
                        >
                            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-error-500/20 transition-all">
                                <LogOut className="w-4 h-4" />
                            </div>
                            <span>Terminate Session</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 lg:hidden animate-fade-in"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
                {/* Floating Header Bar */}
                <header className={`
                    sticky top-0 z-40 px-6 py-4 transition-all duration-500
                    ${scrolled ? 'bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-premium' : 'bg-transparent'}
                `}>
                    <div className="max-w-7xl mx-auto flex items-center gap-6">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-3 bg-white shadow-premium rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all active:scale-95"
                        >
                            <Menu className="w-6 h-6 text-slate-600" />
                        </button>

                        {/* Search Bar (Centered, Premium) */}
                        <div className="hidden md:flex flex-1 max-w-xl group">
                            <div className="relative w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-premium-purple transition-colors" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                    placeholder="Quick Search (Cmd + K)"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-premium-purple/10 focus:border-premium-purple focus:bg-white transition-all shadow-sm group-hover:shadow-card"
                                />
                            </div>
                        </div>

                        {/* Header Actions */}
                        <div className="flex items-center gap-5 ml-auto">
                            {/* Intelligence Alerts */}
                            <button
                                onClick={() => navigate('/admin/quotes')}
                                className="relative p-3 bg-white shadow-premium rounded-2xl border border-slate-100 hover:border-premium-purple/30 group transition-all"
                            >
                                <Bell className="w-5 h-5 text-slate-600 group-hover:text-premium-purple transition-colors" />
                                {unreadQuoteCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-premium-cyan opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-5 w-5 bg-premium-cyan text-[9px] font-black items-center justify-center text-slate-950 shadow-glow-sm">
                                            {unreadQuoteCount}
                                        </span>
                                    </span>
                                )}
                            </button>

                            <div className="h-10 w-[1px] bg-slate-200 hidden sm:block"></div>

                            {/* Luxury Profile Badge */}
                            <div
                                className="flex items-center gap-4 pl-2 group cursor-pointer"
                                onClick={() => navigate('/admin/settings')}
                            >
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-black text-slate-900 group-hover:text-premium-purple transition-colors">
                                        {currentUser?.displayName || 'Elite Administrator'}
                                    </p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Control</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-premium-purple rounded-2xl blur-md opacity-0 group-hover:opacity-40 transition-opacity" />
                                    <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-white border border-slate-200 shadow-premium flex items-center justify-center p-1 group-hover:border-premium-purple group-hover:scale-105 transition-all">
                                        <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center overflow-hidden">
                                            <User className="w-6 h-6 text-premium-purple" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Layout */}
                <main className="flex-1 p-6 lg:p-10">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>

                {/* Refined Footer */}
                <footer className="py-10 px-6 lg:px-10 border-t border-slate-100 bg-white/50 backdrop-blur-md">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center">
                                <span className="text-xs font-black text-premium-cyan">AF</span>
                            </div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-left">
                                Athanuramman Fencing Architectural OS <span className="mx-2 opacity-30">|</span> © 2026
                            </p>
                        </div>

                        <div className="flex items-center gap-8">
                            {['Architecture', 'Governance', 'Enterprise Support'].map((link, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleFooterLink(link)}
                                    className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-premium-purple hover:translate-y-[-1px] transition-all"
                                >
                                    {link}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Environment:</span>
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Production</span>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Global Aesthetic Overlay */}
            <div className="fixed top-0 right-0 w-[1000px] h-[1000px] bg-indigo-50/30 rounded-full blur-[150px] pointer-events-none -z-10 translate-x-1/2 -translate-y-1/2"></div>
        </div>
    );
};

export default AdminLayout;
