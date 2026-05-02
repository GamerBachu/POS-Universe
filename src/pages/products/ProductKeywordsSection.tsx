import { DangerButton, PrimaryButton } from "@/components/button";
import { TextBoxWithLabel } from "@/components/input";
import { useLanguage } from "@/contexts/language";
import type { IProductKeywordView } from "@/types/product";

interface ProductKeywordsSectionProps {
    keywordRows: IProductKeywordView[];
    isReadOnly: boolean;
    onAddRow: () => void;
    onRemoveRow: (rowid: string) => void;
    onChangeRow: (rowid: string, value: string) => void;
}

const ProductKeywordsSection = ({
    keywordRows,
    isReadOnly,
    onAddRow,
    onRemoveRow,
    onChangeRow,
}: ProductKeywordsSectionProps) => {
    const { t } = useLanguage();
    return (
        <div className="flex flex-col h-full bg-gray-50/30 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
            {/* 1. Header Section - Consistent with Attributes & Images */}
            <div className="flex items-center gap-2 p-3 bg-gray-100/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <span className="w-1 h-4 bg-teal-500 rounded-full"></span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    {t("product_inventory.keywords")}
                </h3>
            </div>

            {/* 2. Main Content Area */}
            <div className="p-4 space-y-4">
                {keywordRows.map((row) => {
                    const key = row.rowid ?? (row.id !== undefined ? `id-${row.id}` : "");
                    return (
                        <div
                            key={key}
                            className="flex items-end gap-3 w-full animate-in fade-in duration-200 pb-4 last:pb-0 border-b border-gray-300 dark:border-gray-700 last:border-b-0"
                        >
                            <div className="flex-1">
                                <TextBoxWithLabel
                                    label={t("product_inventory.keyword")}
                                    name={`keyword_${key}`}
                                    value={row.keyword || ""}
                                    disabled={isReadOnly}
                                    onChange={(e) => onChangeRow(key, e.target.value)}
                                    placeholder={t("product_inventory.keyword")}
                                />
                            </div>
                            {!isReadOnly && (
                                <div className="pb-0.5">
                                    <DangerButton
                                        title={t("common.remove")}
                                        onClick={() => onRemoveRow(key)}
                                    >
                                        {t("common.remove")}
                                    </DangerButton>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Empty State - p-2 padding as requested */}
                {keywordRows.length === 0 && (
                    <div className="p-2 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg bg-white/50 dark:bg-gray-950/20">
                        <p className="text-sm text-gray-400">
                            {t("product_inventory.no_keywords")}
                        </p>
                    </div>
                )}
            </div>

            {/* 3. Footer Section - Centered Add Button */}
            {!isReadOnly && (
                <div className="p-3 mt-auto border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 flex justify-center">
                    <PrimaryButton
                        title={t("product_inventory.add_keyword")}
                        onClick={onAddRow}
                    >
                        {t("product_inventory.add_keyword")}
                    </PrimaryButton>
                </div>
            )}
        </div>
    );
};

export default ProductKeywordsSection;
