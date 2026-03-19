import { type SVGProps } from "react";

const PercentageIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        {...props}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="19" y1="5" x2="5" y2="19"></line>
        <circle cx="6.5" cy="6.5" r="2.5"></circle>
        <circle cx="17.5" cy="17.5" r="2.5"></circle>
    </svg>
);

export default PercentageIcon; 