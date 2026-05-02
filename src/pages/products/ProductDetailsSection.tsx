import { TextBoxWithLabel } from "@/components/input";
import { useLanguage } from "@/contexts/language";
import type { IProduct } from "@/types/product";

interface ProductDetailsSectionProps {
  item: IProduct;
  isReadOnly: boolean;
}

export const ProductDetailsSection = ({
  item,
  isReadOnly,
}: ProductDetailsSectionProps) => {
  const { t } = useLanguage();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      <TextBoxWithLabel
        readOnly={true}
        label={t("product_inventory.code")}
        defaultValue={item.code}
        name="code"
        placeholder={t("common.system_generated")}
      />

      <TextBoxWithLabel
        readOnly={isReadOnly}
        label={t("product_inventory.sku")}
        defaultValue={item.sku}
        name="sku"
        placeholder={t("product_inventory.ph_sku")}
        required={true}
      />

      <TextBoxWithLabel
        readOnly={isReadOnly}
        label={t("product_inventory.barcode")}
        defaultValue={item.barcode}
        name="barcode"
        placeholder={t("product_inventory.ph_barcode")}
        required={true}
      />
      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <TextBoxWithLabel
          readOnly={isReadOnly}
          label={t("product_inventory.name")}
          defaultValue={item.name}
          name="name"
          placeholder={t("product_inventory.ph_name")}
          required={true}
        />
      </div>
    </div>
  );
};
