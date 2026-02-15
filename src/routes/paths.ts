export const PATHS = {
    START: '/dashboard',
    HOME: '/home',
    DASHBOARD: '/dashboard',
    ABOUT: '/about',
    LOGIN: '/account/login',
    VERIFY: '/account/verify',
    LOGOUT: '/account/logout',
    REGISTER: '/account/register',
    ERROR: '/error',
    NOT_FOUND:"/not-found"

} as const;

type AppPath = (typeof PATHS)[keyof typeof PATHS];

export const isValidPath = (path: string): path is AppPath => {
    return Object.values(PATHS).includes(path as AppPath);
};