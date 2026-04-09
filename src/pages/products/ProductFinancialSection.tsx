import { useState } from "react";
import InputWithLabel from "@/components/InputWithLabel";
import { useLanguage } from "@/contexts/language";
import type { IProduct } from "@/types/product";
import { calculateFinalPrice } from "@/utils/financial";

interface ProductFinancialSectionProps {
  item: IProduct;
  isReadOnly: boolean;
}

export const ProductFinancialSection: React.FC<
  ProductFinancialSectionProps
> = ({ item, isReadOnly }) => {
  const { t } = useLanguage();
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
        label={t("product_inventory.cost_price")}
        defaultValue={item.costPrice}
        name="costPrice"
        placeholder={t("product_inventory.cost_price")}
        classBox=""
        required={true}
        type="number"
      />

      <InputWithLabel
        readOnly={isReadOnly}
        label={t("product_inventory.selling_price")}
        value={runningPrice.sellingPrice}
        name="sellingPrice"
        placeholder={t("product_inventory.selling_price")}
        classBox=""
        required={true}
        type="number"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handlePriceChange("sellingPrice", e.target.value)
        }
      />
      <InputWithLabel
        readOnly={isReadOnly}
        label={t("product_inventory.discount_in_percent")}
        value={runningPrice.discountInPercent}
        name="discountInPercent"
        placeholder={t("product_inventory.ph_discount_in_percent")}
        classBox=""
        required={true}
        type="number"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handlePriceChange("discountInPercent", e.target.value)
        }
      />
      <InputWithLabel
        readOnly={isReadOnly}
        label={t("product_inventory.tax_rate")}
        value={runningPrice.taxRate}
        name="taxRate"
        placeholder={t("product_inventory.tax_rate")}
        classBox=""
        required={true}
        type="number"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handlePriceChange("taxRate", e.target.value)
        }
      />
      <InputWithLabel
        readOnly={true}
        label={`${t("product_inventory.final_price")} ( ${t("product_inventory.ph_final_price_tc")} )`}
        value={currentFinalPrice}
        name="finalPrice"
        placeholder={t("product_inventory.ph_final_price")}
        classBox=""
        required={false}
        type="text"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handlePriceChange("taxRate", e.target.value)
        }
      />

      <InputWithLabel
        readOnly={isReadOnly}
        label={t("product_inventory.stock")}
        defaultValue={item.stock}
        name="stock"
        placeholder={t("product_inventory.stock")}
        classBox=""
        required={true}
        type="number"
      />

      <InputWithLabel
        readOnly={isReadOnly}
        label={t("product_inventory.reorder_level")}
        defaultValue={item.reorderLevel}
        name="reorderLevel"
        placeholder={t("product_inventory.stock")}
        classBox=""
        required={true}
        type="number"
      />
    </div>
  );
};
