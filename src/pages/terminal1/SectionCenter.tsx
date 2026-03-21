import type { IProductView } from "@/types/product";
import ProductCard from "./ProductCard";

type SectionCenterProps = {
    products: IProductView[];
    onProductClick: (product: IProductView) => void;
};

const SectionCenter = ({ products, onProductClick }: SectionCenterProps) => {
    return (
        <section className="flex-1 flex flex-col min-w-0 bg-gray-100/50 dark:bg-gray-900/50 overflow-hidden">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2 p-2 overflow-y-auto content-start h-full scrollbar-hide">
                {products.map((product: IProductView) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onProductClick={onProductClick}
                    />
                ))}
            </div>
        </section>
    );
};

export default SectionCenter;
