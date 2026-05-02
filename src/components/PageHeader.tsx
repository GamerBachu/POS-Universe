import { SecondaryButton } from "./button";

type PageHeaderProps = {
    subtitle?: string;
    btnLabel?: string;
    btnClass?: string;
    onClick?: () => void;
};

const PageHeader = ({
    subtitle,
    btnLabel,
    btnClass = "",
    onClick,
}: PageHeaderProps) => {
    return (
        <div
            className={`flex ${subtitle && btnLabel ? "justify-between" : "justify-end"} items-center p-2`}
        >
            {subtitle && (
                <h1 className="text-lg font-bold text-gray-800 dark:text-white capitalize overflow-hidden text-ellipsis whitespace-nowrap">
                    {subtitle}
                </h1>
            )}
            {btnLabel && (
                <div>
                    <SecondaryButton
                        onClick={onClick}
                        className={`${btnClass}`}
                        title={btnLabel}
                    >
                        {btnLabel}
                    </SecondaryButton>
                </div>
            )}
        </div>
    );
};

export default PageHeader;
