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
        path: PATHS.HOME,
        label: resource.navigation.home_label,
        description: resource.navigation.home_desc,
        category: "main",
        isVisible: true,
        icon: "🏠",
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
        icon: "🛒",
    },

    // --- Account & Auth Routes ---
    {
        path: PATHS.LOGIN,
        label: resource.navigation.logIn_label,
        description: resource.navigation.logIn_desc,
        category: "account",

        isVisible: false,
        icon: "🔐",
    },
    {
        path: PATHS.REGISTER,
        label: resource.navigation.register_label,
        description: resource.navigation.register_desc,
        category: "account",

        isVisible: false,
        icon: "📝",
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
        path: PATHS.ERROR,
        label: resource.navigation.error_label,
        description: resource.navigation.error_desc,
        category: "system",
        isVisible: false,
        icon: "⚠️",
    },
    {
        path: PATHS.NOT_FOUND,
        label: resource.navigation.not_found_label,
        description: resource.navigation.not_found_desc,
        category: "system",
        isVisible: false,
        icon: "🔍",
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
