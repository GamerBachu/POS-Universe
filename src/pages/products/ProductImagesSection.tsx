import { DangerButton, PrimaryButton } from "@/components/button";
import { TextAreaWithLabel, TextBoxWithLabel } from "@/components/input";
import { useLanguage } from "@/contexts/language";
import type { IProductImageView } from "@/types/product";

interface ProductImagesSectionProps {
  imageRows: IProductImageView[];
  isReadOnly: boolean;
  onAddRow: () => void;
  onRemoveRow: (rowid: string) => void;
  onChangeRow: (
    rowid: string,
    field: "title" | "description" | "url",
    value: string,
  ) => void;
}

export const ProductImagesSection = ({
  imageRows,
  isReadOnly,
  onAddRow,
  onRemoveRow,
  onChangeRow,
}: ProductImagesSectionProps) => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col h-full bg-gray-50/30 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
      {/* 1. Header Section */}
      <div className="flex items-center gap-2 p-3 bg-gray-100/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
        <span className="w-1 h-4 bg-teal-500 rounded-full"></span>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
          {t("product_inventory.images")}
        </h3>
      </div>

      {/* 2. Main Content Area - Removed extra row borders to match Attribute style */}
      <div className="p-4 space-y-4">
        {imageRows.map((row) => {
          const key = row.rowid ?? (row.id !== undefined ? `id-${row.id}` : "");
          return (
            <div
              key={key}
              className="flex flex-col md:flex-row gap-4 animate-in fade-in duration-200 pb-4 last:pb-0 border-b border-gray-300 dark:border-gray-700 last:border-b-0"
            >
              {/* Image Preview Block */}
              <div className="w-full md:w-32 h-32 shrink-0 border border-gray-300 dark:border-gray-600 rounded overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                {row.url ? (
                  <img
                    src={row.url}
                    alt={row.title || "Product"}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="text-[10px] uppercase text-gray-400">
                    No Preview
                  </div>
                )}
              </div>

              {/* Input Fields Section */}
              <div className="flex-1 space-y-2">
                <TextBoxWithLabel
                  label={t("product_inventory.image_title")}
                  name={`imageTitle_${key}`}
                  value={row.title || ""}
                  disabled={isReadOnly}
                  onChange={(e) =>
                    onChangeRow(key, "title", e.target.value)
                  }
                  placeholder={t("product_inventory.image_title")}
                />

                <TextAreaWithLabel
                  label={t("product_inventory.image_description")}
                  name={`imageDescription_${key}`}
                  value={row.description || ""}
                  disabled={isReadOnly}
                  onChange={(e) =>
                    onChangeRow(key, "description", e.target.value)
                  }
                  placeholder={t("product_inventory.image_description")}
                  rows={1}
                />

                <TextBoxWithLabel
                  label={t("product_inventory.image_url")}
                  name={`imageUrl_${key}`}
                  value={row.url || ""}
                  disabled={isReadOnly}
                  onChange={(e) => onChangeRow(key, "url", e.target.value)}
                  placeholder={t("product_inventory.image_url")}
                />



                {!isReadOnly && (
                  <DangerButton
                    title={t("common.remove")}
                    onClick={() => onRemoveRow(key)}
                  >
                    {t("common.remove")}
                  </DangerButton>
                )}
              </div>



            </div>
          );
        })}

        {imageRows.length === 0 && (
          <div className="p-2 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg bg-white/50 dark:bg-gray-950/20">
            <p className="text-sm text-gray-400">
              {t("product_inventory.no_images")}
            </p>
          </div>
        )}
      </div>

      {/* 3. Footer Section */}
      {!isReadOnly && (
        <div className="p-3 mt-auto border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 flex justify-center">
          <PrimaryButton
            title={t("product_inventory.add_image")}
            onClick={onAddRow}
          >
            {t("product_inventory.add_image")}
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};
