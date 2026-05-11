import { CloseIcon } from "@/libs/icons";
import React, { useEffect, useRef, useCallback } from "react";
import { OutlineButton } from "./button";
import { useLanguage } from "@/contexts/language";

type ModalProps = {
    id?: string;
    className?: string; // Changed to optional as it has a default
    children: React.ReactNode;
    title?: string;
    onClose?: () => void;
};

const Modal: React.FC<ModalProps> = ({
    id = "modal-default",
    className = "w-full max-w-sm",
    children,
    title,
    onClose,
}) => {
    const { t } = useLanguage();
    const modalRef = useRef<HTMLDivElement>(null);

    // Memoize close function to prevent unnecessary re-renders
    const handleClose = useCallback(() => {
        onClose?.();
    }, [onClose]);

    useEffect(() => {
        // 1. Focus the modal for accessibility/Escape key
        modalRef.current?.focus();

        // 2. Lock Body Scroll
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = "hidden";

        // 3. Global Escape Key Listener
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };
        window.addEventListener("keydown", handleEsc);

        return () => {
            document.body.style.overflow = originalStyle;
            window.removeEventListener("keydown", handleEsc);
        };
    }, [handleClose]);

    // Handle backdrop click only (not content)
    const onBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) handleClose();
    };

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/30 backdrop-blur-[1px] outline-none"
            onClick={onBackdropClick}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            id={`modal-${id}`}
        >
            <div
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-150 ${className}`}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside

            >
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                        <h3
                            id={`modal-title-${id}`}
                            className="font-bold text-xs uppercase tracking-widest text-gray-600 dark:text-gray-300"
                        >
                            {title || "Modal Title"}
                        </h3>
                    </div>
                    {onClose && (
                        <OutlineButton
                            variant="danger"
                            onClick={handleClose}
                            icon={<CloseIcon className="w-3 h-3" />}
                            className=""
                            title={t("common.close")}
                        >
                        </OutlineButton>
                    )}
                </div>
                <div className="relative">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default React.memo(Modal);