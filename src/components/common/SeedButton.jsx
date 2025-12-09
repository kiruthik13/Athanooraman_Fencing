import React, { useState } from 'react';
import { seedDatabase } from '../../data/seedData';
import { Database, CheckCircle, AlertCircle } from 'lucide-react';

const SeedButton = () => {
    const [seeding, setSeeding] = useState(false);
    const [result, setResult] = useState(null);

    const handleSeed = async () => {
        setSeeding(true);
        setResult(null);

        const res = await seedDatabase();
        setResult(res);
        setSeeding(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-feed-in">
            <button
                onClick={handleSeed}
                disabled={seeding}
                className="btn glass-panel text-neon-blue hover:text-white border-neon-blue/30 hover:border-neon-blue hover:shadow-neon flex items-center gap-2 disabled:opacity-50 transition-all duration-300 rounded-full px-6 py-3"
            >
                <Database className={`w-5 h-5 ${seeding ? 'animate-spin' : ''}`} />
                {seeding ? 'Initializing System...' : 'Seed Data Protocol'}
            </button>

            {result && (
                <div className={`mt-4 p-4 rounded-xl shadow-lg backdrop-blur-md border animate-slide-in ${result.success ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}>
                    <div className="flex items-center gap-3">
                        {result.success ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <AlertCircle className="w-5 h-5" />
                        )}
                        <span className="text-sm font-medium">
                            {result.success ? result.message : result.error}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeedButton;
