import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/language";
import type { TranslationKey } from "@/contexts/language/type";
import { SIDEBAR_MENU } from "@/routes/navigationMenu";
import { PATHS } from "@/routes/paths";
import AppVersion from "./AppVersion";
import useSideBar from "@/hooks/useSideBar";
import SideBarToggle from "./SideBarToggle";
import { CloseIcon } from "@/libs/icons";
import { TextBox } from "./input";
import { OutlineButton } from "./button";

const SideBar = () => {
  const { t } = useLanguage();
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
    let items = SIDEBAR_MENU;

    if (searchTerm.trim()) {
      const searchWords = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
      items = SIDEBAR_MENU.filter((item) => {
        // Search against translated text for a better user experience
        const translatedLabel = t(item.label as TranslationKey).toLowerCase();
        const translatedDesc = item.description ? t(item.description as TranslationKey).toLowerCase() : "";
        const contentToSearch = `${translatedLabel} ${translatedDesc}`;

        return searchWords.every((word) => contentToSearch.includes(word));
      });
    }

    const seenPaths = new Set();
    return items.filter((item) => {
      if (seenPaths.has(item.label)) return false;
      seenPaths.add(item.label);
      return true;
    });
  }, [searchTerm, t]);

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
            <TextBox
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("sidebar.ph_search_menu")}
              className="pr-9"
            />
            <div className="absolute right-0 top-0 h-full w-9 flex items-center justify-center">
              {searchTerm ? (
                <OutlineButton
                  variant="danger"
                  onClick={() => setSearchTerm("")}
                  icon={<CloseIcon className="w-3 h-3" />}
                  className="border-none w-fit p-2 hover:bg-transparent flex items-center justify-center w-6 h-6"
                  title={t("common.clear")}
                >
                </OutlineButton>
              ) : (
                <span className="text-[9px] font-bold text-gray-300 dark:text-gray-600 pointer-events-none group-hover:opacity-0 transition-opacity">
                  {t("common.esc")}
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

              /**
               * 3. Logic:
               * - If it's the dashboard item, mark active if on root "/" or the dashboard path itself.
               * - Otherwise, match by the first segment of the path (module-based highlighting).
               */
              const isHomeItem = item.path === (PATHS.START as string);
              const isActive = isHomeItem
                ? (location.pathname === "/" || location.pathname === PATHS.START)
                : (itemModule === currentModule && currentModule !== undefined);

              return (
                <li key={item.path}
                  title={item.description ? t(item.description as TranslationKey) : ""}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${isActive
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-semibold"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                      }`}
                  >
                    <span className="text-base w-6 shrink-0">{item.icon}</span>
                    <span className="text-sm truncate">{t(item.label as TranslationKey)}</span>
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