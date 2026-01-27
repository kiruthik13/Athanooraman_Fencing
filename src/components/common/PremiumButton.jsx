import React from 'react';
import { Loader2 } from 'lucide-react';

const PremiumButton = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon: Icon,
    onClick,
    className = '',
    disabled = false,
    ...props
}) => {
    const variants = {
        primary: 'btn-premium',
        secondary: 'btn-premium-secondary',
        gold: 'btn-premium-gold',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <button
            onClick={onClick}
            disabled={loading || disabled}
            className={`
        ${variants[variant]}
        ${sizes[size]}
        flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
            {...props}
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : Icon ? (
                <Icon className="w-5 h-5" />
            ) : null}
            {children}
        </button>
    );
};

export default PremiumButton;
