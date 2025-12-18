import React, { createContext, useContext, useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Create Toast Context
const ToastContext = createContext(null);

// Premium Toast Component
const Toast = ({ message, type = 'info', duration = 4000, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Entrance animation
        setTimeout(() => setIsVisible(true), 10);

        // Auto-dismiss timer
        const timer = setTimeout(() => {
            setIsLeaving(true);
            setTimeout(onClose, 400);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(onClose, 400);
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <AlertCircle className="w-5 h-5" />,
        warning: <AlertTriangle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />
    };

    const styles = {
        success: {
            bg: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20',
            border: 'border-green-500/50',
            text: 'text-green-100',
            icon: 'text-green-400',
            shadow: 'shadow-[0_4px_20px_rgba(34,197,94,0.3)]'
        },
        error: {
            bg: 'bg-gradient-to-r from-red-500/20 to-rose-500/20',
            border: 'border-red-500/50',
            text: 'text-red-100',
            icon: 'text-red-400',
            shadow: 'shadow-[0_4px_20px_rgba(239,68,68,0.3)]'
        },
        warning: {
            bg: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20',
            border: 'border-yellow-500/50',
            text: 'text-yellow-100',
            icon: 'text-yellow-400',
            shadow: 'shadow-[0_4px_20px_rgba(234,179,8,0.3)]'
        },
        info: {
            bg: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20',
            border: 'border-blue-500/50',
            text: 'text-blue-100',
            icon: 'text-blue-400',
            shadow: 'shadow-[0_4px_20px_rgba(59,130,246,0.3)]'
        }
    };

    const style = styles[type];

    return (
        <div
            className={`
                fixed top-6 right-6 z-[9999] 
                flex items-center gap-3 
                px-5 py-4 
                rounded-2xl border-2 
                backdrop-blur-xl
                min-w-[320px] max-w-md
                transition-all duration-400 ease-out
                ${style.bg} ${style.border} ${style.shadow}
                ${isVisible && !isLeaving
                    ? 'opacity-100 translate-x-0 scale-100'
                    : 'opacity-0 translate-x-8 scale-95'
                }
            `}
        >
            {/* Icon */}
            <div className={`flex-shrink-0 ${style.icon} drop-shadow-[0_0_8px_currentColor]`}>
                {icons[type]}
            </div>

            {/* Message */}
            <p className={`flex-1 font-medium text-sm ${style.text}`}>
                {message}
            </p>

            {/* Close Button */}
            <button
                onClick={handleClose}
                className={`
                    flex-shrink-0 
                    p-1 rounded-lg 
                    ${style.text} 
                    hover:bg-white/10 
                    transition-all duration-200 
                    hover:scale-110 
                    active:scale-95
                    focus:outline-none
                `}
                aria-label="Close notification"
            >
                <X className="w-4 h-4" />
            </button>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-2xl overflow-hidden">
                <div
                    className={`h-full ${style.icon.replace('text-', 'bg-')} opacity-60`}
                    style={{
                        animation: `shrink ${duration}ms linear forwards`
                    }}
                />
            </div>

            {/* Add keyframe animation for progress bar */}
            <style jsx>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random(); // Ensure unique ID
        setToasts((prev) => [...prev, { id, message, type, duration }]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-0 right-0 z-[9999] pointer-events-none">
                <div className="flex flex-col gap-3 p-6 pointer-events-auto">
                    {toasts.map((toast, index) => (
                        <div
                            key={toast.id}
                            style={{
                                transform: `translateY(${index * 4}px)`,
                                zIndex: 9999 - index
                            }}
                        >
                            <Toast
                                message={toast.message}
                                type={toast.type}
                                duration={toast.duration}
                                onClose={() => removeToast(toast.id)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </ToastContext.Provider>
    );
};

// Hook to use Toast
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export default Toast;
