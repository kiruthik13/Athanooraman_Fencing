import React, { useState, useEffect } from 'react';
import { FolderKanban, Search, Calendar, TrendingUp, Sparkles, Filter, CheckCircle2, Layout, Clock, User, ArrowRight } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useToast } from '../common/Toast';
import LoadingSpinner from '../common/LoadingSpinner';
import GlassCard from '../common/GlassCard';
import AnimatedBackground from '../common/AnimatedBackground';
import PremiumButton from '../common/PremiumButton';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const { showToast } = useToast();

    useEffect(() => {
        setLoading(true);
        const unsubscribe = onSnapshot(collection(db, 'projects'), (snap) => {
            const projectsData = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProjects(projectsData.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt) : 0;
                const dateB = b.createdAt ? new Date(b.createdAt) : 0;
                return dateB - dateA;
            }));
            setLoading(false);
        }, (error) => {
            console.error("Error fetching projects:", error);
            showToast('Failed to fetch projects', 'error');
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
            case 'In Progress':
                return 'bg-premium-cyan/10 text-premium-cyan border-premium-cyan/30';
            case 'Pending':
                return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
            default:
                return 'bg-slate-500/10 text-slate-500 border-slate-500/30';
        }
    };

    const filteredProjects = projects.filter(project => {
        const matchesSearch =
            project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.clientName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) return <LoadingSpinner text="Synchronizing project lifecycles..." />;

    return (
        <div className="space-y-8 relative">
            <AnimatedBackground />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="animate-fade-in">
                    <h1 className="text-4xl font-black text-slate-950 flex items-center gap-3">
                        <FolderKanban className="w-10 h-10 text-premium-purple animate-float" />
                        <span className="gradient-text">Project Ecosystem</span>
                    </h1>
                    <p className="text-slate-600 mt-2 font-medium">Monitoring architectural execution and milestones</p>
                </div>
                <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <div className="px-5 py-3 bg-white shadow-premium rounded-2xl flex items-center gap-3 border border-indigo-50/50">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-sm font-black text-slate-700 uppercase tracking-widest">
                            {projects.filter(p => p.status === 'In Progress').length} Active
                        </span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <GlassCard className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="flex flex-col lg:flex-row gap-6 items-center">
                    <div className="relative flex-1 group w-full">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-premium-purple transition-colors" />
                        <input
                            type="text"
                            placeholder="Locate project by title or client..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-premium-purple/10 focus:border-premium-purple transition-all font-medium"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                        {['All', 'Pending', 'In Progress', 'Completed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`flex-1 lg:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${statusFilter === status
                                    ? 'bg-gradient-to-r from-premium-purple to-indigo-600 text-white shadow-glow'
                                    : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-100'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </GlassCard>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map((project, index) => (
                        <GlassCard
                            key={project.id}
                            className="group animate-fade-in-up hover:translate-y-[-4px] transition-all duration-500"
                            style={{ animationDelay: `${300 + index * 100}ms` }}
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-2xl font-black text-slate-950 group-hover:text-premium-purple transition-colors">
                                            {project.name}
                                        </h3>
                                        <Sparkles className="w-4 h-4 text-premium-cyan animate-pulse" />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 font-mono tracking-widest uppercase bg-slate-100 w-max px-2 py-0.5 rounded">
                                        PRJ-ID: {project.id.slice(0, 12)}
                                    </p>
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(project.status)} shadow-sm`}>
                                    {project.status}
                                </span>
                            </div>

                            {/* Luxury Progress Bar */}
                            <div className="mb-8 p-6 bg-slate-50/50 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-premium-purple/10 transition-all duration-500">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Layout className="w-4 h-4 text-slate-400" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Execution Metric</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-xl font-black text-slate-950 tabular-nums">{project.progress}%</span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Complete</span>
                                    </div>
                                </div>
                                <div className="w-full bg-slate-200/50 rounded-full h-3 p-0.5 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ease-out shadow-glow-sm ${project.status === 'Completed'
                                            ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                                            : 'bg-gradient-to-r from-premium-purple to-premium-cyan'
                                            }`}
                                        style={{ width: `${project.progress}%` }}
                                    >
                                        <div className="w-full h-full bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-shimmer"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Project Details */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-white hover:shadow-card transition-all cursor-pointer group/item">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover/item:bg-premium-purple transition-colors">
                                        <Calendar className="w-5 h-5 text-indigo-600 group-hover/item:text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Initiated</p>
                                        <p className="text-sm font-black text-slate-900">
                                            {new Date(project.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-white hover:shadow-card transition-all cursor-pointer group/item">
                                    <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover/item:bg-premium-cyan transition-colors">
                                        <TrendingUp className="w-5 h-5 text-cyan-600 group-hover/item:text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Classification</p>
                                        <p className="text-sm font-black text-slate-900">{project.type || 'Custom Elite'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-slate-400" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{project.clientName || 'Assigned Client'}</span>
                                </div>
                                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors group/btn">
                                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover/btn:text-premium-purple group-hover/btn:translate-x-1 transition-all" />
                                </button>
                            </div>
                        </GlassCard>
                    ))
                ) : (
                    <div className="col-span-full py-20">
                        <GlassCard className="text-center animate-zoom-in max-w-lg mx-auto">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                                <FolderKanban className="w-12 h-12" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Portfolio Void</h3>
                            <p className="text-slate-500 font-medium">No projects found in the current architectural stream.</p>
                            <PremiumButton
                                variant="outline"
                                className="mt-8"
                                onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
                            >
                                Re-sync Ecosystem
                            </PremiumButton>
                        </GlassCard>
                    </div>
                )}
            </div>

            <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-premium-purple/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-blob"></div>
        </div>
    );
};

export default Projects;
