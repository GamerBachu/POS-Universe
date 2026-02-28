import TextArea from "@/components/TextArea";
import resource from "@/locales/en.json";
import type { IProductDescription } from "@/types/product";

interface ProductDescriptionSectionProps {
    descriptionItem: IProductDescription;
    isReadOnly: boolean;
}

const ProductDescriptionSection: React.FC<ProductDescriptionSectionProps> = ({
    descriptionItem,
    isReadOnly,
}) => {
    return (
        <div>
            <label className="text-xs font-bold uppercase text-gray-500" >
                {resource.product_inventory.description}
            </label>
            <TextArea
                name="descContent"
                defaultValue={descriptionItem.description || ""}
                disabled={isReadOnly}
                placeholder={resource.product_inventory.ph_description}
                rows={3}
            />
        </div>
    );
};
export default ProductDescriptionSection;
