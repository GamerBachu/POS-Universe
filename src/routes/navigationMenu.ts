import type { IMenuItem } from "@/types/menuItem";
import resource from "@/locales/en.json";
import { PATHS } from "./paths";

const NavigationMenu: IMenuItem[] = [
    // --- Main Business Routes ---
    {
        path: PATHS.START,
        label: resource.navigation.dashboard_label,
        description: resource.navigation.dashboard_desc,
        category: "main",
        isVisible: true,
        icon: "📊",
    },

    {
        path: PATHS.TERMINAL_1_POS,
        label: resource.navigation.terminal1_label,
        description: resource.navigation.terminal1_desc,
        category: "main",
        isVisible: true,
        icon: "🖥️",
    },
    {
        path: PATHS.TERMINAL_1_LIST,
        label: resource.navigation.terminal1_order_label,
        description: resource.navigation.terminal1_order_desc,
        category: "main",
        isVisible: true,
        icon: "🧾",
    },

    // --- Product list ----
    {
        path: PATHS.PRODUCT_LIST,
        label: resource.navigation.product_list_label,
        description: resource.navigation.product_list_desc,
        category: "product",
        isVisible: true,
        icon: "🛒",
    },
    {
        path: PATHS.MASTER_ATTRIBUTE_LIST,
        label: resource.navigation.master_pro__attr_label,
        description: resource.navigation.master_pro__attr_desc,
        category: "product",
        isVisible: true,
        icon: "🏷️",
    },

    // -- Reports

    {
        path: PATHS.REPORT,
        label: resource.navigation.report_label,
        description: resource.navigation.report_desc,
        category: "report",
        isVisible: true,
        icon: "📊",
    },

    // --- System & Info Routes ---
    {
        path: PATHS.ABOUT,
        label: resource.navigation.about_label,
        description: resource.navigation.about_desc,
        category: "system",
        isVisible: true,
        icon: "ℹ️",
    },


    {
        path: PATHS.SYSTEM_LOG_LIST,
        label: resource.navigation.system_log_list_label,
        description: resource.navigation.system_log_list_desc,
        category: "system",
        isVisible: true,
        icon: "📋",

    },
    //should on last
    {
        path: PATHS.LOGOUT,
        label: resource.navigation.logout_label,
        description: resource.navigation.logout_desc,
        category: "account",
        isVisible: true,
        icon: "🚪",
    },
] as const;

/**
 * Utility to get only the items intended for Sidebar display.
 */
export const SIDEBAR_MENU = NavigationMenu.filter((item) => item.isVisible);

export default NavigationMenu;
