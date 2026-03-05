import { useAuth } from "@/contexts/authorize";
import ThemeToggleIcon from "./ThemeToggleIcon";
import useSideBar from "@/hooks/useSideBar";
import SideBarToggle from "./SideBarToggle";
import ButtonHome from "./ButtonHome";

const Header = ({ label = "Loading..." }: { label?: string; }) => {
    const auth = useAuth();
    const name = auth.info.isAuthorized
        ? auth.info.authUser?.displayName || ""
        : "...";

    const { isMinimized, maximizeWindow } = useSideBar();
    return (
        <header className="flex justify-between items-center px-4 py-2 bg-white dark:bg-gray-800 flex-shrink-0 transition-colors duration-200">
            {/* Left Side: Breadcrumb Style */}
            <div className="flex items-center text-gray-500 dark:text-gray-400">
                {/* 2. Double Right Icon (Separator) */}
                <div
                    className={`flex items-center overflow-hidden transition-all duration-500 ease-in-out ${isMinimized ? "max-w-[60px] opacity-100 mr-2" : "max-w-0 opacity-0 mr-0"
                        }`}
                >
                    <SideBarToggle onClick={maximizeWindow} isMinimized={isMinimized} />
                    <span className="text-gray-300 dark:text-gray-600 font-light select-none ml-2">|</span>
                </div>

                {/* 1. Home Icon - Sized to h-4 w-4 to match Toggle */}
                <ButtonHome className="mr-2" />

                {/* 2. Slash Separator (Breadcrumb style) */}
                <span className="text-gray-300 dark:text-gray-600 font-light select-none mr-2">
                    /
                </span>

                {/* 3. Current Page Label */}
                <h1 className="text-sm font-bold text-gray-800 dark:text-gray-100 uppercase tracking-tight">
                    {label}
                </h1>
            </div>

            {/* Right Side: User & Theme */}
            <div className="flex items-center gap-4">
                <div className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 rounded-sm">
                    {name}
                </div>

                {/* Toggle button now perfectly matches Home icon size */}
                <ThemeToggleIcon className="p-1 rounded-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm" />
            </div>
        </header>
    );
};

export default Header;
