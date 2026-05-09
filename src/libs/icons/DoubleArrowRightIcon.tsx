import { type SVGProps } from "react";

export const DoubleArrowRightIcon = (props: SVGProps<SVGSVGElement>) => (
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
        <path d="m6 17 5-5-5-5" />
        <path d="m13 17 5-5-5-5" />
    </svg>
);