const Loader = ({ label = "Loading..." }: { label?: string; }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[inherit] w-full space-y-4">
            {/* Outer Spinner */}
            <div className="relative flex items-center justify-center">
                {/* Static Background Ring */}
                <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>

                {/* Animated Spinning Ring */}
                <div className="absolute top-0 left-0 w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>

                {/* Center Pulse Dot */}
                <div className="absolute w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            </div>

            {/* Loading Text */}
            {label && (
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse tracking-wide">
                    {label}
                </p>
            )}
        </div>
    );
};

export default Loader;