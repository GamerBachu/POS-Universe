import { type SVGProps } from "react";

const MinusIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" />
    </svg>
);

export default MinusIcon; 