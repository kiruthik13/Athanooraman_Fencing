import React from 'react';

const GlassCard = ({
    children,
    className = '',
    hover = true,
    glow = false,
    dark = false,
    ...props
}) => {
    const baseClass = dark ? 'glass-card-dark' : (hover ? 'glass-card-hover' : 'glass-card');

    return (
        <div
            className={`
        ${baseClass}
        ${glow ? 'glow-border' : ''}
        p-6
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
};

export default GlassCard;
