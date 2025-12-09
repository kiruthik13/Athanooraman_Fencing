import React from 'react';

const LoadingSpinner = ({ size = 'md', text = '' }) => {
    const sizeClasses = {
        sm: 'w-6 h-6 border-2',
        md: 'w-10 h-10 border-3',
        lg: 'w-16 h-16 border-4'
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 animate-fade-in">
            <div className={`spinner border-t-neon-blue border-r-neon-blue/50 border-b-neon-purple border-l-neon-purple/50 ${sizeClasses[size]}`}></div>
            {text && <p className="mt-4 text-gray-300 font-medium tracking-wide animate-pulse">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;
