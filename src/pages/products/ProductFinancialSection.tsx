import InputWithLabel from "@/components/InputWithLabel";
import resource from "@/locales/en.json";
import type { IProduct } from "@/types/product";

interface ProductFinancialSectionProps {
  item: IProduct;
  isReadOnly: boolean;
}

export const ProductFinancialSection = ({ item, isReadOnly }: ProductFinancialSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">


      <InputWithLabel
        readOnly={isReadOnly}
        label={resource.product_inventory.cost_price}
        defaultValue={item.costPrice}
        name="costPrice"
        placeholder={resource.product_inventory.cost_price}
        classBox=""
        required={true}
        type="number"
      />

      <InputWithLabel
        readOnly={isReadOnly}
        label={resource.product_inventory.selling_price}
        defaultValue={item.sellingPrice}
        name="sellingPrice"
        placeholder={resource.product_inventory.selling_price}
        classBox=""
        required={true}
        type="number"
      />

      <InputWithLabel
        readOnly={isReadOnly}
        label={resource.product_inventory.tax_rate}
        defaultValue={item.taxRate}
        name="taxRate"
        placeholder={resource.product_inventory.tax_rate}
        classBox=""
        required={true}
        type="number"
      />


      <InputWithLabel
        readOnly={isReadOnly}
        label={resource.product_inventory.stock}
        defaultValue={item.stock}
        name="stock"
        placeholder={resource.product_inventory.stock}
        classBox=""
        required={true}
        type="number"
      />


      <InputWithLabel
        readOnly={isReadOnly}
        label={resource.product_inventory.reorder_level}
        defaultValue={item.reorderLevel}
        name="reorderLevel"
        placeholder={resource.product_inventory.stock}
        classBox=""
        required={true}
        type="number"
      />


    </div>
  );
};
