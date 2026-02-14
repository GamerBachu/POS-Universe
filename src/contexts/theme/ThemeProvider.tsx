import { useEffect, useState } from "react";
import type { Theme, ThemeProviderProps } from "./type";
import { applicationStorage, StorageKeys } from "@/utils";
import { ThemeProviderContext } from "./ThemeProviderContext";

export function ThemeProvider({
    children,
    defaultTheme = "system",
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(() => {
        const storage = new applicationStorage(StorageKeys.THEME);
        const storedTheme = storage.get() as Theme | null;
        return storedTheme || defaultTheme;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light";
            root.classList.add(systemTheme);
            return;
        }
        root.classList.add(theme);
    }, [theme]);

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            const storage = new applicationStorage(StorageKeys.THEME);
            storage.set(theme);
            setTheme(theme);
        },
    };

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}
