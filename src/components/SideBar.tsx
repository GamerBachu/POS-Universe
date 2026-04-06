import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/language";
import { SIDEBAR_MENU } from "@/routes/navigationMenu";
import AppVersion from "./AppVersion";
import useSideBar from "@/hooks/useSideBar";
import SideBarToggle from "./SideBarToggle";
import { CloseIcon } from "@/libs/icons";
import Input from "./Input";

const SideBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const { isMinimized, minimizeWindow } = useSideBar();

  const { t } = useLanguage();

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
    let items = SIDEBAR_MENU;

    if (searchTerm.trim()) {
      const searchWords = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
      items = SIDEBAR_MENU.filter((item) => {
        const contentToSearch = `${item.label} ${item.description || ""}`.toLowerCase();
        return searchWords.every((word) => contentToSearch.includes(word));
      });
    }

    const seenPaths = new Set();
    return items.filter((item) => {
      if (seenPaths.has(item.label)) return false;
      seenPaths.add(item.label);
      return true;
    });
  }, [searchTerm]);

  return (
    <>
      <aside
        className={`${!isMinimized ? "w-64" : "w-0 overflow-hidden border-none"} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out`}
      >
        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 relative">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold truncate">
              {t("common.app_name")}
            </h2>
            <SideBarToggle isMinimized={isMinimized} onClick={minimizeWindow} />
          </div>
          <div className="relative group mt-3">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("sidebar.ph_search_menu")}
              className="pr-9"
            />
            <div className="absolute right-0 top-0 h-full w-9 flex items-center justify-center">
              {searchTerm ? (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all active:scale-90"
                >
                  <CloseIcon className="w-3 h-3" />
                </button>
              ) : (
                <span className="text-[9px] font-bold text-gray-300 dark:text-gray-600 pointer-events-none group-hover:opacity-0 transition-opacity">
                  ESC
                </span>
              )}
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 [&::-webkit-scrollbar]:hidden">
          <ul className="space-y-1">
            {filteredMenu.map((item) => {
              // 1. Get the first real segment of the menu path (e.g., "product" or "report")
              // We filter(Boolean) to remove empty strings from the leading slash
              const itemSegments = item.path.split('/').filter(Boolean);
              const itemModule = itemSegments[0];

              // 2. Get the first real segment of the current browser location
              const currentSegments = location.pathname.split('/').filter(Boolean);
              const currentModule = currentSegments[0];

              // 3. Logic:
              // - If it's the dashboard ("/"), check for exact match.
              // - Otherwise, if the first segments match (e.g., both are "product"), it's active.
              const isActive = item.path === "/"
                ? location.pathname === "/"
                : itemModule === currentModule;

              return (
                <li key={item.path} title={item.description}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${isActive
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
                {t("common.no_result")}
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