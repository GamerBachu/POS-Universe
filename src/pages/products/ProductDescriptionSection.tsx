import TextArea from "@/components/TextArea";
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
        <div>
            <label className="text-xs font-bold uppercase text-gray-500" >
                {t("product_inventory.description")}
            </label>
            <TextArea
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
