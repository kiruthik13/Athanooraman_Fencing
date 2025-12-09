import React, { useState, useEffect } from 'react';
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
    Search,
    Bell,
    ChevronDown,
    User
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

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Quotes', path: '/admin/quotes', icon: FileText },
        { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
        { name: 'Customers', path: '/admin/customers', icon: Users },
        { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    const pageDetails = {
        '/admin/dashboard': { title: 'Dashboard', subtitle: 'Overview of your business' },
        '/admin/products': { title: 'Products', subtitle: 'Manage your inventory' },
        '/admin/quotes': { title: 'Quotes', subtitle: 'View and manage proposals' },
        '/admin/projects': { title: 'Projects', subtitle: 'Track project progress' },
        '/admin/customers': { title: 'Customers', subtitle: 'Manage client database' },
        '/admin/reports': { title: 'Reports', subtitle: 'Business analytics' },
        '/admin/settings': { title: 'Settings', subtitle: 'Configure system' },
    };

    const currentPath = pageDetails[location.pathname] || { title: 'Admin', subtitle: 'Control Panel' };

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
        // Refresh count every 30 seconds
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            showToast('Logged out successfully', 'success');
            navigate('/signin');
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-transparent text-gray-100 flex overflow-hidden font-sans">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-4 left-4 z-50 w-72 glass-panel rounded-2xl transform transition-transform duration-300 lg:translate-x-0 border border-white/10 shadow-neon ${sidebarOpen ? 'translate-x-0' : '-translate-x-[110%]'
                    }`}
            >
                <div className="flex flex-col h-full bg-space-black/60 backdrop-blur-xl rounded-2xl overflow-hidden">
                    {/* Logo & System Status */}
                    <div className="p-6 border-b border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-neon-blue to-neon-purple p-[2px] shadow-neon overflow-hidden">
                                <img src={logo} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white tracking-wide">
                                    Athanuramman Fencing
                                </h1>
                                <p className="text-xs text-gray-400">Admin Portal</p>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden ml-auto p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 w-fit">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs font-semibold text-green-400 tracking-wider">SYSTEM ONLINE</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
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
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${active
                                        ? 'bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 text-white border border-neon-blue/30 shadow-[0_0_10px_rgba(0,243,255,0.1)] translate-x-1'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5 hover:translate-x-1'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 transition-transform duration-300 ${active ? 'text-neon-blue scale-110' : 'group-hover:text-neon-blue group-hover:scale-110'}`} />
                                    <span className="font-medium">{item.name}</span>
                                    {active && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-blue shadow-[0_0_10px_#00f3ff] animate-pulse"></div>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* User Profile Card */}
                    <div className="p-4 bg-black/20">
                        <div className="glass-panel p-3 rounded-xl border border-white/5 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-white/10">
                                <User className="w-5 h-5 text-gray-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{currentUser?.displayName || 'Admin User'}</p>
                                <p className="text-xs text-gray-400 truncate">{currentUser?.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:ml-80' : 'lg:ml-80'}`}>
                {/* Top Header */}
                <header className="h-24 flex items-center px-4 lg:px-8 sticky top-0 z-40 bg-transparent">
                    <div className="glass-panel w-full p-4 rounded-2xl flex items-center justify-between animate-slide-in backdrop-blur-xl border border-white/10 shadow-lg">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                            >
                                <Menu className="w-6 h-6" />
                            </button>

                            <div>
                                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple text-glow">
                                    {currentPath.title}
                                </h2>
                                <p className="text-xs text-gray-400 hidden sm:block">{currentPath.subtitle}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 md:gap-6">
                            {/* Search Bar - Hidden on Mobile */}
                            <div className="hidden md:flex relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-neon-blue transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-black/20 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-gray-300 focus:outline-none focus:border-neon-blue/50 focus:shadow-[0_0_10px_rgba(0,243,255,0.1)] w-48 lg:w-64 transition-all"
                                />
                            </div>

                            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                                <button
                                    onClick={() => navigate('/admin/quotes')}
                                    className="relative p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg group"
                                >
                                    <Bell className="w-5 h-5 group-hover:text-neon-blue transition-colors" />
                                    {unreadQuoteCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse border-2 border-space-black">
                                            {unreadQuoteCount > 9 ? '9+' : unreadQuoteCount}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => navigate('/admin/settings')}
                                    className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg group"
                                >
                                    <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-auto animate-fade-in scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    <div className="min-h-full pb-20 lg:pb-0">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default AdminLayout;
