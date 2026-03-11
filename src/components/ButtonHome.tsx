import { PATHS } from "@/routes/paths";
import { useNavigate } from "react-router-dom";

type ButtonHomeProps = {
    className?: string;
};

const ButtonHome = ({ className = "" }: ButtonHomeProps) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(PATHS.DASHBOARD)}
            className={`${className} group relative flex items-center justify-center p-1 rounded-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 shadow-sm transition-all active:scale-90`}
            aria-label="Go to Dashboard"
        >
            <div
                className={`transition-all duration-500  group-hover:text-blue-600 dark:group-hover:text-blue-400 `}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
            </div>
        </button>
    );
};

export default ButtonHome;