import { type IProduct } from "@/types/product";

interface ProductFormProps {
    initialData?: Partial<IProduct>;

    isReadOnly?: boolean;
}

const ProductForm = ({ initialData,  isReadOnly }: ProductFormProps) => {
    return (
        <form onSubmit={(e) => { e.preventDefault(); /* handle submit */ }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Product Name</label>
                <input
                    disabled={isReadOnly}
                    defaultValue={initialData?.name}
                    className="p-2 border rounded bg-white dark:bg-gray-800"
                />
            </div>
            {/* Repeat for Price, Stock, Serial, etc. */}
            {!isReadOnly && (
                <button className="md:col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Save Product
                </button>
            )}
        </form>
    );
};
export default ProductForm;