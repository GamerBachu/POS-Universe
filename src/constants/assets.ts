
import LogoMoon from "@/assets/moon.svg";
import LogoSun from "@/assets/sun.svg";



// Define a type-safe object for global use
export const ASSETS = {
    IMAGES: {
    },
    ICONS: {
        MOON: LogoMoon,
        SUN: LogoSun,
    },
} as const;



// Export type for props (Optional)
export type AssetKey = keyof typeof ASSETS.IMAGES | keyof typeof ASSETS.ICONS;