import { type SVGProps } from "react";

export const MoonIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        width="14"
        height="14"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
    </svg>
);
