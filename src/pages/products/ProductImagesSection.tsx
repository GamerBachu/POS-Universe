import Button from "@/components/Button";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import type { IProductImageView } from "@/types/product";

interface ProductImagesSectionProps {
  imageRows: IProductImageView[];
  isReadOnly: boolean;
  onAddRow: () => void;
  onRemoveRow: (rowid: string) => void;
  onChangeRow: (rowid: string, field: "title" | "description" | "url", value: string) => void;
}

export const ProductImagesSection = ({
  imageRows,
  isReadOnly,
  onAddRow,
  onRemoveRow,
  onChangeRow,
}: ProductImagesSectionProps) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Product Images
      </h3>
      <div className="space-y-3">
        {imageRows.map((row) => {
          const key = row.rowid || `id-${row.id}`;
          return (
            <div key={key} className="p-3 border border-gray-200 dark:border-gray-700 rounded space-y-2">
              <div className="flex gap-2">
                <Input
                  type="text"
                  name={`imageTitle_${key}`}
                  value={row.title || ""}
                  disabled={isReadOnly}
                  onChange={(e) => onChangeRow(row.rowid || row.id?.toString() || "", "title", e.target.value)}
                  placeholder="Image Title"
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
              <TextArea
                name={`imageDescription_${key}`}
                value={row.description || ""}
                disabled={isReadOnly}
                onChange={(e) => onChangeRow(row.rowid || row.id?.toString() || "", "description", e.target.value)}
                placeholder="Image Description"
                rows={2}
              />
              <Input
                type="url"
                name={`imageUrl_${key}`}
                value={row.url || ""}
                disabled={isReadOnly}
                onChange={(e) => onChangeRow(row.rowid || row.id?.toString() || "", "url", e.target.value)}
                placeholder="Image URL (e.g., https://example.com/image.jpg)"
              />
              {row.url && (
                <div className="mt-2 border border-gray-300 dark:border-gray-600 rounded overflow-hidden max-h-32">
                  <img
                    src={row.url}
                    alt={row.title || "Product"}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
        {imageRows.length === 0 && (
          <div className="text-xs text-gray-400">No images added.</div>
        )}
      </div>
      <div className="flex items-center justify-between mt-3">
        {!isReadOnly && (
          <Button
            type="button"
            onClick={onAddRow}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            + Add Image
          </Button>
        )}
      </div>
    </div>
  );
};
