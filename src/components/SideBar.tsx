import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import resource from "@/locales/en.json";
import { SIDEBAR_MENU } from "@/routes/navigationMenu";
import AppVersion from "./AppVersion";

const SideBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const location = useLocation();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSearchTerm("");
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const filteredMenu = useMemo(() => {
        if (!searchTerm.trim()) return SIDEBAR_MENU;
        const searchWords = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
        return SIDEBAR_MENU.filter((item) => {
            const contentToSearch = `${item.label} ${item.description}`.toLowerCase();
            return searchWords.every((word) => contentToSearch.includes(word));
        });
    }, [searchTerm]);

    return (
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0 transition-colors duration-200">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-center">
                    {resource.common.appName}
                </h2>

                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={resource.sidebar.searchPlaceholder}
                        className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-2 [&::-webkit-scrollbar]:hidden">
                <ul className="space-y-1">
                    {filteredMenu.length > 0 ? (
                        filteredMenu.map((item) => {
                            const isActive = location.pathname === item.path;

                            return (
                                <li key={item.path} title={item.description}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${isActive
                                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-semibold shadow-sm"
                                                : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        <span
                                            role="img"
                                            aria-label={item.label}
                                            className={`text-base w-6 shrink-0 transition-transform ${isActive ? "scale-110" : ""}`}
                                        >
                                            {item.icon}
                                        </span>
                                        <span className="text-sm truncate">{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })
                    ) : (
                        <li className="flex flex-col items-center justify-center py-10 px-4 text-center">
                            <span className="text-2xl mb-2 opacity-50">🚫</span>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {resource.sidebar.noResults}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {resource.sidebar.searchPrefix} "{searchTerm}"
                            </p>
                            <button
                                onClick={() => setSearchTerm("")}
                                className="mt-4 text-xs text-blue-500 hover:underline font-medium"
                            >
                                {resource.sidebar.showAll}
                            </button>
                        </li>
                    )}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <AppVersion />
            </div>
        </aside>
    );
};
export default SideBar;
