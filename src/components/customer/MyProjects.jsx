import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Filter, Calendar, User as UserIcon, TrendingUp } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const MyProjects = () => {
    const { currentUser } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        if (currentUser?.email) {
            fetchProjects();
        }
    }, [currentUser]);

    const fetchProjects = async () => {
        try {
            // Filter by clientName (which now holds the email)
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
            case 'In Progress':
                return 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30';
            case 'Completed':
                return 'bg-green-500/20 text-green-400 border border-green-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400';
        }
    };

    const filteredProjects = statusFilter === 'All'
        ? projects
        : projects.filter(p => p.status === statusFilter);

    if (loading) {
        return <LoadingSpinner text="Loading your projects..." />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">My Projects</h2>
                    <p className="text-gray-400 mt-1">Track the progress of your fencing projects</p>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-3 bg-white/5 p-1 rounded-xl border border-white/10">
                    <Filter className="w-5 h-5 text-gray-500 ml-2" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-transparent border-none text-white focus:ring-0 py-2 pr-8 cursor-pointer"
                    >
                        <option className="bg-gray-900" value="All">All Status</option>
                        <option className="bg-gray-900" value="Pending">Pending</option>
                        <option className="bg-gray-900" value="In Progress">In Progress</option>
                        <option className="bg-gray-900" value="Completed">Completed</option>
                    </select>
                </div>
            </div>

            {filteredProjects.length === 0 ? (
                <div className="text-center py-16 glass-panel rounded-2xl border border-white/10">
                    <p className="text-gray-500 text-lg">No projects found.</p>
                    <p className="text-gray-600 text-sm mt-2">Projects linked to <span className="text-neon-blue">{currentUser?.email}</span> will appear here.</p>
                    {statusFilter !== 'All' && (
                        <button
                            onClick={() => setStatusFilter('All')}
                            className="mt-6 btn btn-secondary inline-block"
                        >
                            Clear filter
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredProjects.map((project) => (
                        <div key={project.id} className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{project.name}</h3>
                                    <p className="text-xs text-gray-500 font-mono">ID: {project.id.slice(0, 8)}...</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusColor(project.status)}`}>
                                    {project.status}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">Completion</span>
                                    <span className="font-bold text-neon-blue">{project.progress}%</span>
                                </div>
                                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${project.status === 'Completed'
                                            ? 'bg-gradient-to-r from-green-400 to-green-600'
                                            : 'bg-gradient-to-r from-neon-blue to-neon-purple'
                                            }`}
                                        style={{ width: `${project.progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-3 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <div className="p-1.5 bg-white/5 rounded-lg">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                                </div>

                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <div className="p-1.5 bg-white/5 rounded-lg">
                                        <TrendingUp className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <span>Type: {project.type}</span>
                                </div>

                                {project.updatedAt && (
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <div className="p-1.5 bg-white/5 rounded-lg">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                        </div>
                                        <span>Last Update: {new Date(project.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyProjects;
