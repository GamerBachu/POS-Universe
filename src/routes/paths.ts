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
    NOT_FOUND:"/not-found"

} as const;

type AppPath = (typeof PATHS)[keyof typeof PATHS];

export const isValidPath = (path: string): path is AppPath => {
    return Object.values(PATHS).includes(path as AppPath);
};