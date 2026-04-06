import InputWithLabel from "@/components/InputWithLabel";
import { useLanguage } from "@/contexts/language";
import type { IProduct } from "@/types/product";

interface ProductDetailsSectionProps {
  item: IProduct;
  isReadOnly: boolean;
}

export const ProductDetailsSection = ({ item, isReadOnly }: ProductDetailsSectionProps) => {
  const { t } = useLanguage();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <InputWithLabel
        readOnly={true}
        label={t("product_inventory.code")}
        defaultValue={item.code}
        name="code"
        placeholder={t("common.system_generated")}
        classBox=""
      />

      <InputWithLabel
        readOnly={isReadOnly}
        label={t("product_inventory.sku")}
        defaultValue={item.sku}
        name="sku"
        placeholder={t("product_inventory.ph_sku")}
        classBox=""
        required={true}
      />

      <InputWithLabel
        readOnly={isReadOnly}
        label={t("product_inventory.barcode")}
        defaultValue={item.barcode}
        name="barcode"
        placeholder={t("product_inventory.ph_barcode")}
        classBox=""
        required={true}
      />


      <InputWithLabel
        readOnly={isReadOnly}
        label={t("product_inventory.name")}
        defaultValue={item.name}
        name="name"
        placeholder={t("product_inventory.ph_name")}
        classBox="lg:col-span-2"
        required={true}
      />

    </div>
  );
};
