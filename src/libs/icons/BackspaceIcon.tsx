import { type SVGProps } from "react";

const BackspaceIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            d="M12 19l-7-7 7-7M5 12h14"
        />
    </svg>
);

export default BackspaceIcon; 