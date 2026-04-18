import { useLanguage } from "@/contexts/language";
import { HouseIcon } from "@/libs/icons";
import { PATHS } from "@/routes/paths";
import { useNavigate } from "react-router-dom";

type ButtonHomeProps = {
    className?: string;
};

const ButtonHome = ({ className = "" }: ButtonHomeProps) => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <button
            onClick={() => navigate(PATHS.DASHBOARD)}
            className={`${className} group relative flex items-center justify-center p-1 rounded-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 shadow-sm transition-all active:scale-90`}
            aria-label="Go to Dashboard"
            title={t("navigation.dashboard_label")}
        >
            <div
                className={`transition-all duration-500  group-hover:text-blue-600 dark:group-hover:text-blue-400 `}
            >
                <HouseIcon
                    className="text-gray-500 dark:text-gray-400"
                />
            </div>
        </button>
    );
};

export default ButtonHome;