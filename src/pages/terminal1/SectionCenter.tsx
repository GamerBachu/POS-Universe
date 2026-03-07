import React from 'react';
import ProductCard from './ProductCard';

type Product = {
    id: string;
    name: string;
    price: number;
    code: string;
};

type Props = {
    products: Product[];
    onProductClick: (product: Product) => void;
};

const SectionCenter = ({ products, onProductClick }: Props) => {
    return (
        <section className="flex-1 flex flex-col min-w-0 bg-gray-100/50 dark:bg-gray-900/50">
            <div className="p-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 overflow-y-auto content-start">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={"$" + product.price.toFixed(2)}
                        onClick={() => onProductClick(product)}
                    />
                ))}
            </div>
        </section>
    );
};

export default SectionCenter;