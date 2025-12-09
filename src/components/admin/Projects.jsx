import React, { useState, useEffect } from 'react';
import { FolderKanban, Plus, Search, Filter, MoreVertical, CheckCircle, Clock, AlertCircle, PlayCircle, Edit } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useToast } from '../common/Toast';
import LoadingSpinner from '../common/LoadingSpinner';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newProject, setNewProject] = useState({ name: '', clientName: '', type: 'Residential', status: 'In Progress', progress: 0 });
    const { showToast } = useToast();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'projects'));
            const projectsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProjects(projectsData);
        } catch (error) {
            console.error("Error fetching projects:", error);
            showToast('Failed to fetch projects', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProject = async (e) => {
        e.preventDefault();

        // Logic Validation
        let finalProgress = Math.min(100, Math.max(0, Number(newProject.progress)));
        let finalStatus = newProject.status;

        if (finalProgress === 100) {
            finalStatus = 'Completed';
        } else if (finalStatus === 'Completed' && finalProgress < 100) {
            finalStatus = 'In Progress';
        }

        const projectData = {
            ...newProject,
            progress: finalProgress,
            status: finalStatus,
            updatedAt: new Date().toISOString()
        };

        try {
            if (editingId) {
                await updateDoc(doc(db, 'projects', editingId), projectData);
                showToast('Project updated successfully', 'success');
            } else {
                await addDoc(collection(db, 'projects'), {
                    ...projectData,
                    createdAt: new Date().toISOString()
                });
                showToast('Project created successfully', 'success');
            }

            closeModal();
            fetchProjects();
        } catch (error) {
            showToast('Failed to save project', 'error');
        }
    };

    const handleMarkCompleted = async (id) => {
        if (window.confirm('Mark this project as completed?')) {
            try {
                await updateDoc(doc(db, 'projects', id), {
                    status: 'Completed',
                    progress: 100,
                    updatedAt: new Date().toISOString()
                });
                showToast('Project marked as completed', 'success');
                fetchProjects();
            } catch (error) {
                showToast('Failed to update project', 'error');
            }
        }
    };

    const handleEditClick = (project) => {
        setEditingId(project.id);
        setNewProject({
            name: project.name,
            clientName: project.clientName,
            type: project.type,
            status: project.status,
            progress: project.progress
        });
        setShowAddModal(true);
    };

    const closeModal = () => {
        setShowAddModal(false);
        setEditingId(null);
        setNewProject({ name: '', clientName: '', type: 'Residential', status: 'In Progress', progress: 0 });
    };

    const filteredProjects = projects.filter(project =>
        project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'text-green-400 bg-green-500/10 border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]';
            case 'In Progress': return 'text-neon-blue bg-neon-blue/10 border-neon-blue/20 shadow-neon';
            case 'Pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20 shadow-[0_0_10px_rgba(250,204,21,0.2)]';
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
        }
    };

    if (loading) return <LoadingSpinner text="Loading projects..." />;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple text-glow">
                        Active Projects
                    </h1>
                    <p className="text-gray-400 mt-1">Track progress and milestones</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-primary flex items-center gap-2 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Add Project</span>
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
                            placeholder="Search projects..."
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
                                <th className="px-6 py-4 text-xs font-semibold text-neon-blue uppercase tracking-wider">Project Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-neon-purple uppercase tracking-wider">Client Email</th>
                                <th className="px-6 py-4 text-xs font-semibold text-white uppercase tracking-wider">Progress</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredProjects.length > 0 ? (
                                filteredProjects.map((project) => (
                                    <tr key={project.id} className="group hover:bg-white/5 transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-white group-hover:text-neon-blue transition-colors">{project.name}</span>
                                        </td>
                                        <td
                                            className="px-6 py-4 text-gray-300 cursor-pointer hover:text-neon-blue transition-colors"
                                            onClick={() => setSearchTerm(project.clientName)}
                                            title="Filter by this client"
                                        >
                                            {project.clientName}
                                        </td>
                                        <td className="px-6 py-4 w-1/4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-gray-400">{project.progress}%</span>
                                                </div>
                                                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${project.status === 'Completed'
                                                            ? 'bg-gradient-to-r from-green-400 to-green-600'
                                                            : 'bg-gradient-to-r from-neon-blue to-neon-purple'
                                                            }`}
                                                        style={{ width: `${project.progress}%` }}
                                                    >
                                                        <div className="absolute inset-0 bg-white/20 animate-pulse-fast"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                                                {project.status === 'Completed' ? <CheckCircle className="w-3 h-3 mr-1" /> : <PlayCircle className="w-3 h-3 mr-1" />}
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">{project.type}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditClick(project)}
                                                    className="p-2 text-gray-400 hover:text-neon-blue hover:bg-neon-blue/10 rounded-lg transition-colors group/btn"
                                                    title="Edit Project"
                                                >
                                                    <Edit className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                                </button>
                                                {project.status !== 'Completed' && (
                                                    <button
                                                        onClick={() => handleMarkCompleted(project.id)}
                                                        className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors group/check"
                                                        title="Mark as Completed"
                                                    >
                                                        <CheckCircle className="w-4 h-4 group-hover/check:scale-110 transition-transform" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <FolderKanban className="w-12 h-12 mb-4 mx-auto opacity-50" />
                                            <p className="text-lg">No active projects found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Project Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="glass-panel w-full max-w-md rounded-2xl border border-neon-blue/30 shadow-neon overflow-hidden animate-slide-in">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h3 className="text-xl font-bold text-white">{editingId ? 'Edit Project' : 'New Project'}</h3>
                        </div>
                        <form onSubmit={handleSaveProject} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Project Name</label>
                                <input type="text" required className="input w-full bg-black/20 border-white/10 text-white" value={newProject.name} onChange={e => setNewProject({ ...newProject, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Client Email</label>
                                <input type="email" required className="input w-full bg-black/20 border-white/10 text-white" value={newProject.clientName} onChange={e => setNewProject({ ...newProject, clientName: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                                <select className="input w-full bg-black/20 border-white/10 text-white" value={newProject.type} onChange={e => setNewProject({ ...newProject, type: e.target.value })}>
                                    <option className="bg-gray-900" value="Residential">Residential</option>
                                    <option className="bg-gray-900" value="Commercial">Commercial</option>
                                    <option className="bg-gray-900" value="Industrial">Industrial</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Progress (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="input w-full bg-black/20 border-white/10 text-white"
                                    value={newProject.progress}
                                    onChange={e => {
                                        let val = parseInt(e.target.value);
                                        if (val > 100) val = 100;
                                        if (val < 0) val = 0;
                                        setNewProject({ ...newProject, progress: val })
                                    }}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 btn btn-primary">{editingId ? 'Update' : 'Create'} Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Projects;
