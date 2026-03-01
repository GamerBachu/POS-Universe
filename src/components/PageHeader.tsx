import Button from "./Button";

type PageHeaderProps = {
    subtitle?: string;
    btnLabel?: string;
    btnClass?: string;
    onClick?: () => void;
};

const PageHeader = ({
    subtitle,
    btnLabel,
    btnClass = "bg-gray-600 hover:bg-gray-700", //bg-green-600 hover:bg-green-700
    onClick,
}: PageHeaderProps) => {



    return (
        <div className={`flex ${(subtitle && btnLabel) ? "justify-between" : "justify-end"} items-center p-2`}>
            {subtitle && (
                <h1 className="text-lg font-bold text-gray-800 dark:text-white capitalize overflow-hidden text-ellipsis whitespace-nowrap">
                    {subtitle}
                </h1>
            )}
            {btnLabel && (
                <Button
                    type="button"
                    onClick={onClick}
                    className={`${btnClass}`}
                >
                    {btnLabel}
                </Button>
            )}
        </div>
    );
};

export default PageHeader;
