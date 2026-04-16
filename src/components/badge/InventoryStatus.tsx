import React from "react";
import { useLanguage } from "@/contexts/language";

type InventoryStatusProps = React.HTMLAttributes<HTMLSpanElement> & {
    isActive: boolean;
    stock: number;
    reorderLevel: number;
    showCount?: boolean;  
};

const InventoryStatus = ({
    isActive,
    stock,
    reorderLevel,
    showCount = false,
    className = "",
    ...rest
}: InventoryStatusProps) => {
    const { t } = useLanguage();

    const getStatus = () => {
        if (!isActive) {
            return {
                label: t("common.inactive"),
                classes: "bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400",
            };
        }
        if (stock <= 0) {
            return {
                label: t("reports.inventory_status_out"),
                classes: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            };
        }
        if (stock <= reorderLevel) {
            return {
                label: t("reports.inventory_status_low"),
                classes: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
            };
        }
        return {
            label: t("reports.inventory_status_ok"),
            classes: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
        };
    };

    const { label, classes } = getStatus();

    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest tabular-nums ${classes} ${className}`}
            {...rest}
        >
            {label}
            {showCount && `: ${stock}`}
        </span>
    );
};

export default InventoryStatus;