import { Button } from "@/components/button";
import { SelectWithLabel, TextBoxWithLabel } from "@/components/input";
import { useLanguage } from "@/contexts/language";
import type { IMasterProductAttribute } from "@/types/masters";
import type { IProductAttributeView } from "@/types/product";


interface ProductAttributesSectionProps {
  attributeRows: IProductAttributeView[];
  masterAttributes: IMasterProductAttribute[];
  isReadOnly: boolean;
  onAddRow: () => void;
  onRemoveRow: (rowid: string) => void;
  onChangeRow: (rowid: string, field: "attributeId" | "value", value: string | number) => void;
}

export const ProductAttributesSection: React.FC<ProductAttributesSectionProps> = ({
  attributeRows,
  masterAttributes,
  isReadOnly,
  onAddRow,
  onRemoveRow,
  onChangeRow,
}: ProductAttributesSectionProps) => {
  const { t } = useLanguage();
  return (
    <div
      className="flex flex-col h-full bg-gray-50/30 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm"
    >
      {/* 1. Header Section - Defined with a specific background */}
      <div className="flex items-center gap-2 p-3 bg-gray-100/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
        <span className="w-1 h-4 bg-teal-500 rounded-full"></span>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
          {t("product_inventory.attributes")}
        </h3>
      </div>

      {/* 2. Main Content Area */}
      <div className="p-4 space-y-4">
        {attributeRows.map((row) => (
          <div key={row.rowid}
            className="flex flex-row items-end gap-3 w-full animate-in fade-in duration-200 pb-4 last:pb-0 border-b border-gray-300 dark:border-gray-700 last:border-b-0"
          >
            {/* Inputs start from the left */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
              <SelectWithLabel
                label={t("product_inventory.attribute")}
                name={`attributeId_${row.rowid}`}
                value={row.attributeId ? String(row.attributeId) : "-1"}
                disabled={isReadOnly}
                onChange={(e) => onChangeRow(row.rowid, "attributeId", Number(e.target.value))}
                required
              >
                <option value="-1">{t("product_inventory.select_attribute")}</option>
                {masterAttributes.map((attr) => (
                  <option key={"s" + attr.id + row.rowid} value={String(attr.id)}>
                    {attr.name}
                  </option>
                ))}
              </SelectWithLabel>

              <TextBoxWithLabel
                name={`attributeValue_${row.rowid}`}
                label={t("product_inventory.attribute_value")}
                value={row.value}
                disabled={isReadOnly}
                onChange={(e) => onChangeRow(row.rowid, "value", e.target.value)}
                placeholder={t("product_inventory.attribute_value")}
                required
              />
            </div>

            {/* Danger button pushed to the right - Small sizing preserved */}
            {!isReadOnly && (
              <div className="pb-0.5">
                <Button
                  variant="danger"
                  onClick={() => onRemoveRow(row.rowid)}
                  title={t("common.remove")}
                > {t("common.remove")}
                </Button>
              </div>
            )}
          </div>
        ))}

        {attributeRows.length === 0 && (
          <div className="py-2 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg bg-white/50 dark:bg-gray-950/20">
            <p className="text-sm text-gray-400">{t("product_inventory.no_attributes")}</p>
          </div>
        )}
      </div>

      {/* 3. Footer Section - Centered Add Button */}
      {!isReadOnly && (
        <div className="p-3 mt-auto border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 flex justify-center">
          <Button
            variant="primary"
            onClick={onAddRow}
            title={t("product_inventory.add_attribute")}

          >
            {t("product_inventory.add_attribute")}
          </Button>
        </div>
      )}
    </div>
  );
};
