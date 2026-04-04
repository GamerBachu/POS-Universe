import React from "react";
import { useTranslation } from "@/contexts/language";


interface PaginationProps {
    currentPage: number;
    totalCount: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    isLoading: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalCount,
    pageSize,
    onPageChange,
    isLoading,
}) => {
    const { t } = useTranslation();
    const totalPages = Math.ceil(totalCount / pageSize);

    if (totalPages <= 0) return null;

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };


    const formatString = (template: string, ...args: (string | number)[]) => {
        return template.replace(/{(\d+)}/g, (match, number) => {
            return typeof args[number] !== 'undefined' ? String(args[number]) : match;
        });
    };


    return (
        <div className="flex items-center justify-between px-1 py-2">
            <span className="text-xs font-mono text-gray-500">
                {formatString(
                    t("common.pagination_info"),
                    (currentPage - 1) * pageSize + 1,
                    Math.min(currentPage * pageSize, totalCount),
                    totalCount
                )}
            </span>
            <div className="flex gap-2">
                <button
                    disabled={currentPage === 1 || isLoading}
                    onClick={handlePrevious}
                    className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1 rounded text-xs font-bold uppercase disabled:opacity-30 transition-all"
                >
                    {t("common.previous")}
                </button>
                <button
                    disabled={currentPage === totalPages || isLoading}
                    onClick={handleNext}
                    className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1 rounded text-xs font-bold uppercase disabled:opacity-30 transition-all"
                >
                    {t("common.next")}
                </button>
            </div>
        </div>
    );
};

export default Pagination;