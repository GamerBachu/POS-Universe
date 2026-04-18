import type { IMenuItem } from "@/types/menuItem";
import { PATHS } from "./paths";
import type { TranslationKey } from "@/contexts/language/type";

const NavigationMenu = [
    // --- Main Business Routes ---
    {
        path: PATHS.START,
        label: "navigation.dashboard_label",
        description: "navigation.dashboard_desc",
        category: "main",
        isVisible: true,
        icon: "📊",
    },

    {
        path: PATHS.TERMINAL_1_POS,
        label: "navigation.terminal1_label",
        description: "navigation.terminal1_desc",
        category: "main",
        isVisible: true,
        icon: "🖥️",
    },
    {
        path: PATHS.TERMINAL_1_LIST,
        label: "navigation.terminal1_order_label",
        description: "navigation.terminal1_order_desc",
        category: "main",
        isVisible: true,
        icon: "🧾",
    },

    // --- Product list ----
    {
        path: PATHS.PRODUCT_LIST,
        label: "navigation.product_list_label",
        description: "navigation.product_list_desc",
        category: "product",
        isVisible: true,
        icon: "🛒",
    },
    {
        path: PATHS.MASTER_ATTRIBUTE_LIST,
        label: "navigation.master_pro__attr_label",
        description: "navigation.master_pro__attr_desc",
        category: "product",
        isVisible: true,
        icon: "🏷️",
    },

    // -- Reports

    {
        path: PATHS.REPORT,
        label: "navigation.report_label",
        description: "navigation.report_desc",
        category: "report",
        isVisible: true,
        icon: "📊",
    },

    // --- System & Info Routes ---
    {
        path: PATHS.ABOUT,
        label: "navigation.about_label",
        description: "navigation.about_desc",
        category: "system",
        isVisible: true,
        icon: "ℹ️",
    },


    {
        path: PATHS.SYSTEM_LOG_LIST,
        label: "navigation.system_log_list_label",
        description: "navigation.system_log_list_desc",
        category: "system",
        isVisible: true,
        icon: "📋",

    },
    //should on last
    {
        path: PATHS.LOGOUT,
        label: "navigation.logout_label",
        description: "navigation.logout_desc",
        category: "account",
        isVisible: true,
        icon: "🚪",
    },
] as const satisfies Array<Omit<IMenuItem, 'label' | 'description'> & { label: TranslationKey; description: TranslationKey; }>;

/**
 * Utility to get only the items intended for Sidebar display.
 */
export const SIDEBAR_MENU = NavigationMenu.filter((item) => item.isVisible);

/**
 * Returns the menu items with labels and descriptions translated.
 * Use this inside components where 't' is available.
 */
export const getTranslatedMenu = (t: (key: TranslationKey) => string): IMenuItem[] => {
    return NavigationMenu.map((item) => ({
        ...item,
        label: t(item.label),
        description: t(item.description),
    }));
};

export default NavigationMenu;
