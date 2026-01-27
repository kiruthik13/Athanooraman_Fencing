import React from 'react';

const LoadingSpinner = ({ size = 'md', text = '' }) => {
    const sizeClasses = {
        sm: 'spinner-sm',
        md: 'spinner',
        lg: 'spinner-lg'
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 animate-fade-in">
            <div className={sizeClasses[size]}></div>
            {text && <p className="mt-4 text-slate-600 font-medium">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;
