import React, { createContext, useContext, useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Create Toast Context
const ToastContext = createContext(null);

// Professional Toast Component
const Toast = ({ message, type = 'info', duration = 4000, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Entrance animation
        setTimeout(() => setIsVisible(true), 10);

        // Auto-dismiss timer
        const timer = setTimeout(() => {
            setIsLeaving(true);
            setTimeout(onClose, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(onClose, 300);
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <AlertCircle className="w-5 h-5" />,
        warning: <AlertTriangle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />
    };

    const styles = {
        success: 'toast-success',
        error: 'toast-error',
        warning: 'toast-warning',
        info: 'toast-info'
    };

    const iconColors = {
        success: 'text-success-600',
        error: 'text-error-600',
        warning: 'text-warning-600',
        info: 'text-info-600'
    };

    return (
        <div
            className={`
                toast ${styles[type]}
                flex items-center gap-3
                min-w-[320px] max-w-md
                transition-all duration-300 ease-out
                ${isVisible && !isLeaving
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-8'
                }
            `}
        >
            {/* Icon */}
            <div className={`flex-shrink-0 ${iconColors[type]}`}>
                {icons[type]}
            </div>

            {/* Message */}
            <p className="flex-1 font-medium">
                {message}
            </p>

            {/* Close Button */}
            <button
                onClick={handleClose}
                className="
                    flex-shrink-0 
                    p-1 rounded-lg 
                    hover:bg-slate-900/10
                    transition-all duration-200 
                    focus:outline-none
                    focus:ring-2 focus:ring-slate-400
                "
                aria-label="Close notification"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random();
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
                    {toasts.map((toast) => (
                        <Toast
                            key={toast.id}
                            message={toast.message}
                            type={toast.type}
                            duration={toast.duration}
                            onClose={() => removeToast(toast.id)}
                        />
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

