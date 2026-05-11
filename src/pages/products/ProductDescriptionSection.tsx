import { TextAreaWithLabel } from "@/components/input";
import { useLanguage } from "@/contexts/language";
import type { IProductDescription } from "@/types/product";

interface ProductDescriptionSectionProps {
    descriptionItem: IProductDescription;
    isReadOnly: boolean;
}

const ProductDescriptionSection: React.FC<ProductDescriptionSectionProps> = ({
    descriptionItem,
    isReadOnly,
}) => {
    const { t } = useLanguage();
    return (
        <div className="mt-4">
            <TextAreaWithLabel
                label={t("product_inventory.description")}
                name="descContent"
                defaultValue={descriptionItem.description || ""}
                disabled={isReadOnly}
                placeholder={t("product_inventory.ph_description")}
                rows={3}
            />
        </div>
    );
};
export default ProductDescriptionSection;
