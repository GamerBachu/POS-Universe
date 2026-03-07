

type SideBarToggleProps = {
    className?: string;
    onClick: () => void;
    isMinimized: boolean;
};

const SideBarToggle: React.FC<SideBarToggleProps> = ({
    className = "",
    onClick,
    isMinimized,
}) => {
    return (
        <button
            onClick={onClick}
            className={`${className} group relative flex items-center justify-center p-1 rounded-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 shadow-sm transition-all active:scale-90`}
            aria-label="Toggle Theme"
        >
            <div
                className={`transition-all duration-500 ${isMinimized ? "rotate-0" : "rotate-[360deg]"} group-hover:text-blue-600 dark:group-hover:text-blue-400 `}
            >
                {isMinimized === true ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m6 17 5-5-5-5" />
                        <path d="m13 17 5-5-5-5" />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                )}
            </div>
        </button>
    );
};
export default SideBarToggle;
