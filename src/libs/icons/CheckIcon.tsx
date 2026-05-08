import { type SVGProps } from "react";

const CheckIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="4.5"
        {...props}

    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export default CheckIcon;  