import Button from "@/components/Button";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import resource from "@/locales/en.json";
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
      <label className="text-xs font-bold uppercase text-gray-500" >
        {resource.product_inventory.images}
      </label>
      <div className="space-y-2">
        {imageRows.map((row) => {
          const key = row.rowid ?? (row.id !== undefined ? `id-${row.id}` : "");
          return (
            <div key={key} className="p-3 border border-gray-200 dark:border-gray-700 rounded space-y-2">
              <div className="flex gap-2">
                <Input
                  type="text"
                  name={`imageTitle_${key}`}
                  value={row.title || ""}
                  disabled={isReadOnly}
                  onChange={(e) => onChangeRow(key, "title", e.target.value)}
                  placeholder={resource.product_inventory.image_title}
                />
                {!isReadOnly && (
                  <Button
                    type="button"
                    onClick={() => onRemoveRow(key)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    {resource.common.remove}
                  </Button>
                )}
              </div>
              <TextArea
                name={`imageDescription_${key}`}
                value={row.description || ""}
                disabled={isReadOnly}
                onChange={(e) => onChangeRow(key, "description", e.target.value)}
                placeholder={resource.product_inventory.image_description}
                rows={2}
              />
              <Input
                type="url"
                name={`imageUrl_${key}`}
                value={row.url || ""}
                disabled={isReadOnly}
                onChange={(e) => onChangeRow(row.rowid || row.id?.toString() || "", "url", e.target.value)}
                placeholder={resource.product_inventory.image_url}
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
          <div className="text-xs text-gray-400">{resource.product_inventory.no_images}</div>
        )}
      </div>
      <div className="flex items-center justify-between mt-3">
        {!isReadOnly && (
          <Button
            type="button"
            onClick={onAddRow}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {resource.product_inventory.add_image}
          </Button>
        )}
      </div>
    </div>
  );
};
