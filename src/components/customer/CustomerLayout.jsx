import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.jpg';
import { LogOut, Package, FolderKanban, Calculator, User, FileText, Menu, X, Sparkles, Bell, Search, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../common/Toast';

const CustomerLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, logout } = useAuth();
    const { showToast } = useToast();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const navItems = [
        { name: 'Products', path: '/customer/dashboard', icon: Package },
        { name: 'Execution Matrix', path: '/customer/projects', icon: FolderKanban },
        { name: 'Precision Calc', path: '/customer/calculator', icon: Calculator },
        { name: 'Proposal Ledger', path: '/customer/quotes', icon: FileText },
        { name: 'Identity Hub', path: '/customer/profile', icon: User },
    ];

    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            showToast('Session terminated successfully', 'success');
            navigate('/signin');
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            showToast(`Architectural scan initiated for: ${searchQuery}`, 'neutral');
        }
    };

    const handleFooterLink = (link) => {
        showToast(`${link} protocols is currently under architectural encryption`, 'neutral');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-[#FDFCFE] flex overflow-hidden">
            {/* Sidebar Shell */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50
                w-80 bg-slate-950 text-white
                transform transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                border-r border-white/5 flex flex-col
            `}>
                {/* Visual Identity Block */}
                <div className="p-10">
                    <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/customer/dashboard')}>
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-premium-purple/30 group-hover:border-premium-purple transition-all duration-500 shadow-glow-sm">
                            <img src={logo} alt="Logo" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        </div>
                        <div className="text-left">
                            <h1 className="text-2xl font-black tracking-tight leading-none">Athanuramman Fencing</h1>
                            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-premium-purple mt-1">Client Portal</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Lattice */}
                <nav className="flex-1 px-6 space-y-3">
                    {navItems.map((item, idx) => {
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
                                    relative flex items-center gap-4 w-full px-6 py-4 rounded-2xl
                                    transition-all duration-500 group overflow-hidden
                                    ${active
                                        ? 'bg-gradient-to-r from-premium-purple to-premium-cyan text-white shadow-glow animate-fade-in'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'}
                                `}
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                <Icon className={`w-5 h-5 transition-transform duration-500 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className={`text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ${active ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                                    {item.name}
                                </span>
                                {active && (
                                    <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Account Interaction Bar */}
                <div className="p-8 border-t border-white/5 space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all cursor-default">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Elite Access</span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 w-full px-6 py-4 rounded-2xl text-rose-400 hover:bg-rose-500/10 transition-all group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Terminate Session</span>
                    </button>
                </div>
            </aside>

            {/* Content Scaffolding */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Floating Navigation Header */}
                <header className="h-[100px] border-b border-slate-100 px-8 lg:px-12 flex items-center gap-8 bg-white/80 backdrop-blur-xl z-10 sticky top-0">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden w-12 h-12 flex items-center justify-center bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
                    >
                        <Menu className="w-6 h-6 text-slate-900" />
                    </button>

                    {/* Integrated Command Bar */}
                    <div className="hidden md:flex flex-1 items-center max-w-xl relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-premium-purple transition-colors" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            placeholder="Type to search architecture..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-premium-purple/10 focus:border-premium-purple transition-all"
                        />
                    </div>

                    <div className="flex-1 md:hidden" />

                    {/* Elite Control Strip */}
                    <div className="flex items-center gap-6">
                        <button className="relative w-12 h-12 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100 hover:border-premium-purple/30 group transition-all">
                            <Bell className="w-5 h-5 text-slate-400 group-hover:text-premium-purple transition-all" />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                        </button>

                        <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 group cursor-pointer hover:border-premium-purple/30 transition-all" onClick={() => navigate('/customer/profile')}>
                            <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                                <User className="w-5 h-5 text-premium-cyan" />
                            </div>
                            <div className="hidden sm:block pr-4 text-left">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Authenticated as</p>
                                <p className="text-sm font-black text-slate-900 leading-none truncate max-w-[120px]">
                                    {currentUser?.displayName || currentUser?.email?.split('@')[0]}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dynamic Content Reservoir */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-slate-50/50">
                    <div className="max-w-[1600px] mx-auto p-8 lg:p-12">
                        <Outlet />
                    </div>

                    {/* Sophisticated Footer Shell */}
                    <footer className="px-8 lg:px-12 py-12 bg-white border-t border-slate-100">
                        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-premium-purple" />
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 text-left">
                                    Architected by <span className="text-slate-950">Athanuramman Fencing Elite</span> — {new Date().getFullYear()}
                                </p>
                            </div>
                            <div className="flex items-center gap-8">
                                {['Legal', 'Encryption', 'Contact Support'].map(link => (
                                    <button
                                        key={link}
                                        onClick={() => handleFooterLink(link)}
                                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-premium-purple transition-colors"
                                    >
                                        {link}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </footer>
                </main>
            </div>

            {/* Neural Overlay (Mobile) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 lg:hidden animate-fade-in"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default CustomerLayout;
