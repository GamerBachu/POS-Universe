import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import resource from "@/locales/en.json";
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
  return (
    <div>
      <label className="text-xs font-bold uppercase text-gray-500" >
        {resource.product_inventory.attributes}
      </label>
      <div className="space-y-2">
        {attributeRows.map((row) => (
          <div key={row.rowid} className="flex gap-2 items-center">
            <Select
              name={`attributeId_${row.rowid}`}
              value={row.attributeId ? String(row.attributeId) : "-1"}
              disabled={isReadOnly}
              onChange={(e) => onChangeRow(row.rowid, "attributeId", Number(e.target.value))}
              required
            >
              <option value="-1">{resource.product_inventory.select_attribute}</option>
              {masterAttributes.map((attr) => (
                <option key={"s" + attr.id + row.rowid} value={String(attr.id)}>{attr.name}</option>
              ))}
            </Select>
            <Input
              key={"i" + row.rowid}
              name={`attributeValue_${row.rowid}`}
              type="text"
              value={row.value}
              disabled={isReadOnly}
              onChange={(e) => onChangeRow(row.rowid, "value", e.target.value)}
              placeholder={resource.product_inventory.attribute_value}
              required
            />
            {!isReadOnly && (
              <Button
                type="button"
                key={"b" + row.rowid}
                onClick={() => onRemoveRow(row.rowid)}
                className="bg-red-500 hover:bg-red-600"
              >
                {resource.common.remove}
              </Button>
            )}
          </div>
        ))}
        {attributeRows.length === 0 && (
          <div className="text-xs text-gray-400">{resource.product_inventory.no_attributes}</div>
        )}
      </div>

      <div className="flex items-center justify-between mt-2">
        {!isReadOnly && (
          <Button
            type="button"
            onClick={onAddRow}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {resource.product_inventory.add_attribute}
          </Button>
        )}
      </div>
    </div>
  );
};
