export const PATHS = {
    START: '/dashboard',
    DASHBOARD: '/dashboard',
    HOME: '/home',
    ABOUT: '/about',
    LOGIN: '/account/login',
    REGISTER: '/account/register',
    LOGOUT: '/account/logout',
    VERIFY: '/account/verify',
    ERROR: '/error',
    NOT_FOUND: "/not-found",
    PRODUCT_LIST: "/product_v1/list",
    PRODUCT_ADD: "/product_v1/add",
    PRODUCT_EDIT: "/product_v1/edit/",
    PRODUCT_VIEW: "/product_v1/view/",
    PRODUCT_DELETE: "/product_v1/delete/",

    MASTER_ATTRIBUTE_LIST: "/m_pro_attribute/list",
    MASTER_ATTRIBUTE_ADD: "/m_pro_attribute/page/add/",
    MASTER_ATTRIBUTE_EDIT: "/m_pro_attribute/page/edit/",
    MASTER_ATTRIBUTE_VIEW: "/m_pro_attribute/page/view/",
    MASTER_ATTRIBUTE_DELETE: "/m_pro_attribute/page/delete/",


    SYSTEM_LOG_LIST: "/sys_log/list",
    SYSTEM_LOG_ADD: "/sys_log/page/add/",
    SYSTEM_LOG_EDIT: "/sys_log/page/edit/",
    SYSTEM_LOG_VIEW: "/sys_log/page/view/",
    SYSTEM_LOG_DELETE: "/sys_log/page/delete/",


} as const;

type AppPath = (typeof PATHS)[keyof typeof PATHS];

export const isValidPath = (path: string): path is AppPath => {
    return Object.values(PATHS).includes(path as AppPath);
};