import Button from "@/components/Button";
import Input from "@/components/Input";
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
    return (
        <div>
            <label className="text-xs font-bold uppercase text-gray-500" >
                Product Keywords
            </label>
            <div className="space-y-2">
                {keywordRows.map((row) => {
                    const key = row.rowid || `id-${row.id}`;
                    return (
                        <div key={key} className="flex gap-2 items-center">
                            <Input
                                type="text"
                                name={`keyword_${key}`}
                                value={row.keyword || ""}
                                disabled={isReadOnly}
                                onChange={(e) => onChangeRow(row.rowid || row.id?.toString() || "", e.target.value)}
                                placeholder="Keyword"
                            />
                            {!isReadOnly && (
                                <Button
                                    type="button"
                                    onClick={() => onRemoveRow(row.rowid || row.id?.toString() || "")}
                                    className="bg-red-500 hover:bg-red-600"
                                >
                                    Remove
                                </Button>
                            )}
                        </div>
                    );
                })}
                {keywordRows.length === 0 && (
                    <div className="text-xs text-gray-400">No keywords added.</div>
                )}
            </div>
            <div className="flex items-center justify-between mt-3">
                {!isReadOnly && (
                    <Button
                        type="button"
                        onClick={onAddRow}
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                        + Add Keyword
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ProductKeywordsSection;