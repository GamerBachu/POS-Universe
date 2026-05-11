import { type SVGProps } from "react";

export const ChevronLeftIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        width="14"
        height="14"
        strokeWidth="3.0"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M15 19l-7-7 7-7" />
    </svg>
);