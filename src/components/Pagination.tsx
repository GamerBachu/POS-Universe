import React from "react";
import { useLanguage } from "@/contexts/language";
import { OutlineButton } from "./button";


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
    const { t } = useLanguage();
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
        <div className="flex items-center justify-between px-2 py-2">
            <span className="text-sm font-mono text-gray-500">
                {formatString(
                    t("common.pagination_info"),
                    (currentPage - 1) * pageSize + 1,
                    Math.min(currentPage * pageSize, totalCount),
                    totalCount
                )}
            </span>
            <div className="flex gap-2">
                <OutlineButton
                    variant="neutral"
                    disabled={currentPage === 1 || isLoading}
                    onClick={handlePrevious}
                    title={t("common.previous")}
                >
                    {t("common.previous")}
                </OutlineButton>
                <OutlineButton
                    variant="neutral"
                    disabled={currentPage === totalPages || isLoading}
                    onClick={handleNext}
                    title={t("common.next")}
                >
                    {t("common.next")}
                </OutlineButton>
            </div>
        </div>
    );
};

export default Pagination;