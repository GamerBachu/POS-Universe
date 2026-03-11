import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import resource from "@/locales/en.json";
import { SIDEBAR_MENU } from "@/routes/navigationMenu";
import AppVersion from "./AppVersion";
import useSideBar from "@/hooks/useSideBar";
import SideBarToggle from "./SideBarToggle";

const SideBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const { isMinimized, minimizeWindow } = useSideBar();

  // Clear search on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchTerm("");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter menu logic
  const filteredMenu = useMemo(() => {
    if (!searchTerm.trim()) return SIDEBAR_MENU;
    const searchWords = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
    return SIDEBAR_MENU.filter((item) => {
      const contentToSearch = `${item.label} ${item.description}`.toLowerCase();
      return searchWords.every((word) => contentToSearch.includes(word));
    });
  }, [searchTerm]);
  return (
    <>
      <aside
        className={`${!isMinimized ? "w-64" : "w-0 overflow-hidden border-none"} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold truncate">
              {resource.common.app_name}
            </h2>
            <SideBarToggle isMinimized={isMinimized} onClick={minimizeWindow} />
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={resource.sidebar.ph_search_menu}
              className="w-full px-3 py-1.5 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 [&::-webkit-scrollbar]:hidden">
          <ul className="space-y-1">
            {filteredMenu.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path} title={item.description}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                      isActive
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-semibold"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    <span className="text-base w-6 shrink-0">{item.icon}</span>
                    <span className="text-sm truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
            {filteredMenu.length === 0 && (
              <li className="text-center py-4 text-xs text-gray-500">
                {resource.common.no_result}
              </li>
            )}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <AppVersion />
        </div>
      </aside>
    </>
  );
};

export default SideBar;
