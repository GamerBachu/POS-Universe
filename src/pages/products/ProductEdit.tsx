import ProductForm from "./ProductForm";

const ProductEdit = () => (
    <div className="p-6">
        <h2 className="text-xl mb-4">Edit Product</h2>
        <ProductForm onSubmit={(data) => console.log('Update Dexie', data)}
            initialData={undefined} />
    </div>
);
export default ProductEdit;