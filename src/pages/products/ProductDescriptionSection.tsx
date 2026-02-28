import TextArea from "@/components/TextArea";
import type { IProductDescription } from "@/types/product";

interface ProductDescriptionSectionProps {
    descriptionItem: IProductDescription;
    isReadOnly: boolean;
}

const ProductDescriptionSection = ({
    descriptionItem,
    isReadOnly,
}: ProductDescriptionSectionProps) => {
    return (
        <div>
            <label className="text-xs font-bold uppercase text-gray-500" >
                Product Description
            </label>
            <TextArea
                name={`descContent`}
                defaultValue={descriptionItem.description || ""}
                disabled={isReadOnly}
                placeholder="Description Content"
                rows={3}
            />
        </div>
    );
};
export default ProductDescriptionSection;
