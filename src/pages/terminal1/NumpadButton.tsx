const NumpadButton = ({
    children,
    className = "",
    onClick,
}: {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}) => (
    <button
        type="button"
        onClick={onClick}
        className={`h-14 flex items-center justify-center bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 border-b-2 border-b-gray-300 dark:border-b-gray-950 font-bold text-xl tracking-tight transition-all duration-75 hover:bg-gray-50 dark:hover:bg-gray-700 active:translate-y-[2px] active:border-b-0 active:bg-teal-600 active:text-white shadow-sm ${className}`}
    >
        {children}
    </button>
);

export default NumpadButton;