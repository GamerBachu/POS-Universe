import type React from "react";

type PageHeaderProps = {
    subtitle?: string;
    btnLabel?: string;
    children: React.ReactNode;
};

const PageHeader = ({ subtitle, btnLabel, children }: PageHeaderProps) => {
    return (
        <div
            className={`flex ${subtitle && btnLabel ? "justify-between" : "justify-end"} items-center p-2`}
        >
            {subtitle && (
                <h1 className="text-lg font-bold text-gray-800 dark:text-white capitalize overflow-hidden text-ellipsis whitespace-nowrap">
                    {subtitle}
                </h1>
            )}
            {children}
        </div>
    );
};

export default PageHeader;
