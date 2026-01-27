import React from 'react';

const AnimatedBackground = ({ variant = 'default' }) => {
    if (variant === 'none') return null;

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Animated Gradient Blobs */}
            <div
                className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 animate-blob"
                style={{
                    background: 'linear-gradient(135deg, #2E5DDE 0%, #00D9FF 100%)',
                }}
            />
            <div
                className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 animate-blob"
                style={{
                    background: 'linear-gradient(135deg, #7C3AED 0%, #2E5DDE 100%)',
                    animationDelay: '2s',
                }}
            />
            <div
                className="absolute bottom-0 left-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 animate-blob"
                style={{
                    background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
                    animationDelay: '4s',
                }}
            />
        </div>
    );
};

export default AnimatedBackground;
