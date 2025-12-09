import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, DollarSign, Calculator, Smartphone, Save, RefreshCw, Moon, Sun, Monitor, Trash2 } from 'lucide-react';
import { useToast } from '../common/Toast';

const Settings = () => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Mock Settings State
    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            push: true,
            orderUpdates: true,
            lowStockWarnings: false
        },
        system: {
            taxRate: 18,
            currency: 'INR',
            supportPhone: '+91 98765 43210'
        },
        theme: 'dark'
    });

    const handleToggle = (category, key) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: !prev[category][key]
            }
        }));
        setHasUnsavedChanges(true);
    };

    const handleChange = (category, key, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }));
        setHasUnsavedChanges(true);
    };

    const handleSave = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setLoading(false);
        setHasUnsavedChanges(false);
        showToast('System configuration saved successfully', 'success');
    };

    const handleClearCache = () => {
        if (window.confirm('Clear local application cache? This will refresh the page.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple text-glow">
                        System Configuration
                    </h1>
                    <p className="text-gray-400 mt-1">Manage global preferences and application behavior</p>
                </div>

                {hasUnsavedChanges && (
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="btn btn-primary flex items-center gap-2 animate-bounce-subtle"
                    >
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl">

                {/* Notification Settings */}
                <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-neon">
                    <div className="p-6 border-b border-white/10 bg-white/5 flex items-center gap-3">
                        <div className="p-2 bg-neon-blue/10 rounded-lg border border-neon-blue/20">
                            <Bell className="w-5 h-5 text-neon-blue" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Notifications</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <div>
                                <h3 className="text-gray-200 font-medium">Email Alerts</h3>
                                <p className="text-sm text-gray-500">Receive quotes and orders via email</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.email}
                                    onChange={() => handleToggle('notifications', 'email')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-blue/80"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <div>
                                <h3 className="text-gray-200 font-medium">Low Stock Warnings</h3>
                                <p className="text-sm text-gray-500">Alert when inventory drops below 10 units</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.lowStockWarnings}
                                    onChange={() => handleToggle('notifications', 'lowStockWarnings')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-blue/80"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <div>
                                <h3 className="text-gray-200 font-medium">Desktop Notifications</h3>
                                <p className="text-sm text-gray-500">Push alerts for real-time updates</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.push}
                                    onChange={() => handleToggle('notifications', 'push')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-blue/80"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Business Parameters */}
                <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-neon">
                    <div className="p-6 border-b border-white/10 bg-white/5 flex items-center gap-3">
                        <div className="p-2 bg-neon-purple/10 rounded-lg border border-neon-purple/20">
                            <Calculator className="w-5 h-5 text-neon-purple" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Business Parameters</h2>
                    </div>
                    <div className="p-6 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Default Tax Rate (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={settings.system.taxRate}
                                        onChange={(e) => handleChange('system', 'taxRate', e.target.value)}
                                        className="input w-full bg-black/20 border-white/10 text-white focus:border-neon-purple"
                                    />
                                    <span className="absolute right-3 top-2.5 text-gray-500">%</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Currency</label>
                                <div className="relative">
                                    <select
                                        value={settings.system.currency}
                                        onChange={(e) => handleChange('system', 'currency', e.target.value)}
                                        className="input w-full bg-black/20 border-white/10 text-white focus:border-neon-purple appearance-none"
                                    >
                                        <option value="INR">INR (₹)</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                    </select>
                                    <DollarSign className="absolute right-3 top-2.5 text-gray-500 w-4 h-4 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Support Phone Number</label>
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
                                <input
                                    type="text"
                                    value={settings.system.supportPhone}
                                    onChange={(e) => handleChange('system', 'supportPhone', e.target.value)}
                                    className="input w-full pl-10 bg-black/20 border-white/10 text-white focus:border-neon-purple"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Displayed on customer invoices and footer.</p>
                        </div>
                    </div>
                </div>

                {/* Data & Cache */}
                <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-neon lg:col-span-2">
                    <div className="p-6 border-b border-white/10 bg-white/5 flex items-center gap-3">
                        <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                            <Trash2 className="w-5 h-5 text-red-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Data management</h2>
                    </div>
                    <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="text-gray-200 font-medium">Local Application Cache</h3>
                            <p className="text-sm text-gray-500">Clear local storage to resolve display issues. This will not delete database records.</p>
                        </div>
                        <button
                            onClick={handleClearCache}
                            className="btn bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 flex items-center gap-2 whitespace-nowrap"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear Cache
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;
