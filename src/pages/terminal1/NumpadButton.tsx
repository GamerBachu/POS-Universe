const NumpadButton = ({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
    <button className={`h-14 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 font-bold text-lg text-gray-700 dark:text-gray-300 active:bg-teal-500 active:text-white transition-colors ${className}`} onClick={onClick}>
        {children}
    </button>
);

export default NumpadButton;