type SummaryCardProps = {
    label: string;
    value: string | number;
    color?: string; // Tailwind color class, e.g., "text-green-500"
    sub?: string;
};

const SummaryCard = ({
    label,
    value,
    color = "text-green-500",
    sub,
}: SummaryCardProps) => {
    return (
        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
            <p className="text-[10px] uppercase">
                {label}
            </p>
            <p className={`text-2xl font-bold my-1 ${color}`}>{value}</p>
            {sub && <p className="text-[10px] ">{sub}</p>}
        </div>
    );
};

export default SummaryCard;