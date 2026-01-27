import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { FolderKanban, Calendar, TrendingUp, Package, Sparkles, ArrowRight, ShieldCheck, Zap, Layers } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import { useToast } from '../common/Toast';
import GlassCard from '../common/GlassCard';
import AnimatedBackground from '../common/AnimatedBackground';
import PremiumButton from '../common/PremiumButton';

const MyProjects = () => {
    const { currentUser } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        if (currentUser?.email) {
            fetchProjects();
        }
    }, [currentUser]);

    const fetchProjects = async () => {
        try {
            const q = query(
                collection(db, 'projects'),
                where('clientName', '==', currentUser.email)
            );
            const querySnapshot = await getDocs(q);
            const projectsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProjects(projectsData);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        const styles = {
            'Pending': {
                bg: 'bg-amber-50',
                text: 'text-amber-600',
                border: 'border-amber-100',
                label: 'Awaiting'
            },
            'In Progress': {
                bg: 'bg-premium-cyan/10',
                text: 'text-premium-cyan',
                border: 'border-premium-cyan/20',
                label: 'Executing'
            },
            'Completed': {
                bg: 'bg-emerald-50',
                text: 'text-emerald-600',
                border: 'border-emerald-100',
                label: 'Delivered'
            }
        };
        return styles[status] || {
            bg: 'bg-slate-50',
            text: 'text-slate-600',
            border: 'border-slate-100',
            label: status
        };
    };

    const filteredProjects = statusFilter === 'All'
        ? projects
        : projects.filter(p => p.status === statusFilter);

    if (loading) {
        return <LoadingSpinner text="Consulting our execution logs..." />;
    }

    return (
        <div className="space-y-10 relative">
            <AnimatedBackground />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="animate-fade-in">
                    <h1 className="text-4xl font-black text-slate-950 flex items-center gap-3">
                        <FolderKanban className="w-10 h-10 text-premium-cyan animate-float" />
                        <span className="gradient-text">Execution Matrix</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-xs">Real-time tracking of architectural milestones</p>
                </div>

                <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-400">
                                ENG
                            </div>
                        ))}
                    </div>
                    <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Pro Services<br />Assigned</span>
                </div>
            </div>

            {/* Filter Hub */}
            <div className="flex flex-wrap items-center gap-4 bg-white/40 backdrop-blur-xl p-2 rounded-3xl border border-white shadow-premium animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                {['All', 'Pending', 'In Progress', 'Completed'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${statusFilter === status
                            ? 'bg-slate-950 text-white shadow-glow'
                            : 'text-slate-400 hover:text-slate-950 hover:bg-white'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {filteredProjects.length === 0 ? (
                <GlassCard className="text-center py-32 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <div className="relative w-24 h-24 mx-auto mb-8">
                        <div className="absolute inset-0 bg-slate-100 rounded-3xl -rotate-6 animate-pulse"></div>
                        <div className="relative w-full h-full bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100">
                            <Layers className="w-10 h-10 text-slate-200" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-black text-slate-950 mb-3">No Active Deployments</h3>
                    <p className="text-slate-500 font-medium max-w-md mx-auto italic">
                        Once your proposal is verified and synchronized, project execution tracking will appear here.
                    </p>
                    {statusFilter !== 'All' && (
                        <PremiumButton
                            variant="outline"
                            className="mt-10"
                            onClick={() => setStatusFilter('All')}
                            icon={ArrowRight}
                        >
                            Review All Files
                        </PremiumButton>
                    )}
                </GlassCard>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {filteredProjects.map((project, idx) => {
                        const style = getStatusStyle(project.status);
                        return (
                            <GlassCard
                                key={project.id}
                                hover
                                className="group animate-fade-in-up flex flex-col h-full"
                                style={{ animationDelay: `${300 + idx * 100}ms` }}
                            >
                                {/* Project Header */}
                                <div className="flex items-start justify-between mb-8">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-premium-cyan animate-ping" />
                                            <span className="text-[10px] font-black text-premium-cyan uppercase tracking-widest">Live Execution</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-950 group-hover:text-premium-cyan transition-colors">
                                            {project.name}
                                        </h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            Asset Ref: {project.id.slice(0, 12).toUpperCase()}
                                        </p>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-xl ${style.bg} ${style.border} border text-[10px] font-black uppercase tracking-widest ${style.text}`}>
                                        {style.label}
                                    </div>
                                </div>

                                {/* Premium Progress Bar */}
                                <div className="mb-10 space-y-4">
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Completion Status</p>
                                            <span className="text-3xl font-black text-slate-950 tracking-tighter">{project.progress}%</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                                            <TrendingUp className="w-3 h-3" />
                                            Optimal Pace
                                        </div>
                                    </div>
                                    <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                        <div
                                            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${project.status === 'Completed' ? 'bg-emerald-500' : 'bg-gradient-to-r from-premium-purple to-premium-cyan'
                                                }`}
                                            style={{ width: `${project.progress}%` }}
                                        >
                                            <div className="absolute inset-0 bg-shimmer animate-shimmer opacity-30"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Project Intelligence Grid */}
                                <div className="grid grid-cols-2 gap-6 mt-auto">
                                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 flex items-center gap-4 group/item hover:bg-white hover:shadow-card transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-100 group-hover/item:border-premium-purple transition-all">
                                            <Calendar className="w-5 h-5 text-premium-purple" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Inception</p>
                                            <p className="text-xs font-black text-slate-900 leading-none">
                                                {new Date(project.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 flex items-center gap-4 group/item hover:bg-white hover:shadow-card transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-100 group-hover/item:border-premium-cyan transition-all">
                                            <Sparkles className="w-5 h-5 text-premium-cyan" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Tier</p>
                                            <p className="text-xs font-black text-slate-900 leading-none truncate max-w-[80px]">
                                                {project.type || 'Custom'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="mt-8 py-4 w-full bg-slate-950 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 hover:bg-premium-cyan hover:text-slate-950 transition-all active:scale-95 shadow-glow-sm"
                                    onClick={() => showToast('Master file repository synchronized', 'success')}
                                >
                                    Review Files <ArrowRight className="w-4 h-4" />
                                </button>
                            </GlassCard>
                        );
                    })}
                </div>
            )}

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-premium-cyan/5 rounded-full blur-[150px] pointer-events-none -z-10 animate-blob"></div>
        </div>
    );
};

export default MyProjects;
