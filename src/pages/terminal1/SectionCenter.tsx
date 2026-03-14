import type { IProductView } from "@/types/product";
import ProductCard from "./ProductCard";

type SectionCenterProps = {
    products: IProductView[];
    onProductClick: (product: IProductView) => void;
};

const SectionCenter = ({ products, onProductClick }: SectionCenterProps) => {
    return (
        <section className="flex-1 flex flex-col min-w-0 bg-gray-100/50 dark:bg-gray-900/50 overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-1 p-1 overflow-y-auto hover:overflow-y-auto h-full content-start">
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
