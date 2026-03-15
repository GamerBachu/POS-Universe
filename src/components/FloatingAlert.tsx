import type { TStatusType } from "@/types/actionState";
import { useEffect } from "react";


type FloatingAlertProps = {
    message: string;
    type: TStatusType;
    onClose: () => void;
    duration?: number;
};

const statusStyles = {
    success: "bg-teal-50 border-teal-200 text-teal-800 dark:bg-teal-900/40 dark:border-teal-800 dark:text-teal-400",
    error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/40 dark:border-red-800 dark:text-red-400",
    warning: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/40 dark:border-amber-800 dark:text-amber-400",
    info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/40 dark:border-blue-800 dark:text-blue-400",
};

const FloatingAlert = ({ message, type, onClose, duration = 3000 }: FloatingAlertProps) => {
    
    // Auto-dismiss logic
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm px-4">
            <div className={`flex items-center gap-3 p-3 rounded-xl border shadow-lg backdrop-blur-sm transition-all animate-bounce-in ${statusStyles[type]}`}>
                
                {/* Your Provided SVGs */}
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    {type === "success" && <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />}
                    {type === "error" && <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />}
                    {type === "warning" && <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />}
                    {type === "info" && <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                </svg>
                
                <p className="flex-1 text-[13px] font-bold leading-tight">
                    {message}
                </p>

                {/* Vanilla Close Icon */}
                <button 
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default FloatingAlert;