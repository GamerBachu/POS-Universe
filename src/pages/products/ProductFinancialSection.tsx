import { useState } from "react";
import InputWithLabel from "@/components/InputWithLabel";
import resource from "@/locales/en.json";
import type { IProduct } from "@/types/product";
import { calculateFinalPrice } from "../terminal1/utils";

interface ProductFinancialSectionProps {
  item: IProduct;
  isReadOnly: boolean;
}

export const ProductFinancialSection: React.FC<
  ProductFinancialSectionProps
> = ({ item, isReadOnly }) => {
  const [runningPrice, setRunningPrice] = useState({
    sellingPrice: item.sellingPrice,
    discountInPercent: item.discountInPercent,
    taxRate: item.taxRate,
  });

  const handlePriceChange = (
    field: keyof typeof runningPrice,
    value: string,
  ) => {
    const val = parseFloat(value);
    setRunningPrice((prev) => ({ ...prev, [field]: isNaN(val) ? 0 : val }));
  };

  const currentFinalPrice = calculateFinalPrice({
    ...item,
    sellingPrice: runningPrice.sellingPrice,
    discountInPercent: runningPrice.discountInPercent,
    taxRate: runningPrice.taxRate,
  });
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 items-end">
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
        value={runningPrice.sellingPrice}
        name="sellingPrice"
        placeholder={resource.product_inventory.selling_price}
        classBox=""
        required={true}
        type="number"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handlePriceChange("sellingPrice", e.target.value)
        }
      />
      <InputWithLabel
        readOnly={isReadOnly}
        label={resource.product_inventory.discount_in_percent}
        value={runningPrice.discountInPercent}
        name="discountInPercent"
        placeholder={resource.product_inventory.ph_discount_in_percent}
        classBox=""
        required={true}
        type="number"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handlePriceChange("discountInPercent", e.target.value)
        }
      />
      <InputWithLabel
        readOnly={isReadOnly}
        label={resource.product_inventory.tax_rate}
        value={runningPrice.taxRate}
        name="taxRate"
        placeholder={resource.product_inventory.tax_rate}
        classBox=""
        required={true}
        type="number"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handlePriceChange("taxRate", e.target.value)
        }
      />
      <InputWithLabel
        readOnly={true}
        label={`${resource.product_inventory.final_price} ( ${resource.product_inventory.ph_final_price_tc} )`}
        value={currentFinalPrice}
        name="finalPrice"
        placeholder={resource.product_inventory.ph_final_price}
        classBox=""
        required={false}
        type="text"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handlePriceChange("taxRate", e.target.value)
        }
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
