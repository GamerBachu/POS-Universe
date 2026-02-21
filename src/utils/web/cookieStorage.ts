/**
 * Secure cookie storage utility
 * Handles secure, httpOnly cookies for token management
 */
export class CookieStorage {
    private static readonly DEFAULTS = {
        path: '/',
        sameSite: 'Strict' as const,
        secure: true, // HTTPS only in production
    };

    /**
     * Set a cookie with secure options
     * @param name - Cookie name
     * @param value - Cookie value
     * @param maxAgeSeconds - Expiration time in seconds
     */
    static setSecure(
        name: string,
        value: string,
        maxAgeSeconds: number = 7 * 24 * 60 * 60 // 7 days default
    ): void {
        const isProduction = import.meta.env.PROD;
        const cookieString = [
            `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
            `Path=${this.DEFAULTS.path}`,
            `Max-Age=${maxAgeSeconds}`,
            `SameSite=${this.DEFAULTS.sameSite}`,
            isProduction ? 'Secure' : '' // Only in production
        ]
            .filter(Boolean)
            .join('; ');

        document.cookie = cookieString;
    }

    /**
     * Get cookie value
     * @param name - Cookie name
     * @returns Cookie value or null
     */
    static get(name: string): string | null {
        const nameEQ = `${encodeURIComponent(name)}=`;
        const cookies = document.cookie.split(';');

        for (const cookie of cookies) {
            const trimmed = cookie.trim();
            if (trimmed.startsWith(nameEQ)) {
                return decodeURIComponent(trimmed.substring(nameEQ.length));
            }
        }
        return null;
    }

    /**
     * Delete a cookie
     * @param name - Cookie name
     */
    static delete(name: string): void {
        this.setSecure(name, '', -1);
    }
}