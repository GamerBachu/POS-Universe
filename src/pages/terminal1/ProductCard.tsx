import { memo } from "react";
import useCurrencySymbol from "@/hooks/useCurrencySymbol";
import type { IProductView } from "@/types/product";
import { displayPrice } from "@/utils/helper/numberUtils";
import { calculateFinalPrice } from "./utils";

type ProductCardProps = {
    product: IProductView;
    onProductClick: (product: IProductView) => void;
};

const ProductCard = ({ product, onProductClick }: ProductCardProps) => {
    const currencySymbol = useCurrencySymbol();

    const isLowStock = (product.stock || 0) <= (product.reorderLevel || 0);

    return (
        <button
            title={`${product.name} - ${currencySymbol}${displayPrice(product.sellingPrice)} - ${product.code || "N/A"}`}
            className="group flex flex-col w-full min-w-[80px] h-full bg-white dark:bg-gray-800 p-1 rounded-sm border border-gray-200 dark:border-gray-700 hover:border-teal-500 hover:shadow-sm transition-all text-center active:scale-95"
            onClick={() => onProductClick(product)}
        >
            {/* Icon Area: Changed shrink-0 to shrink to allow it to give space to text if needed */}
            <div className="aspect-[5/4] w-full bg-gray-100 dark:bg-gray-700/50 rounded-md mb-2 flex items-center justify-center shrink">
                <svg
                    className="w-5 h-5 text-gray-300 dark:text-gray-500 group-hover:text-teal-500 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
            </div>

            {/* Name: Added min-h to ensure it always occupies 2 lines of space */}
            <div className="min-h-[2.4em] flex items-center justify-center mb-0.5">
                <span className="text-[11px] font-semibold line-clamp-2 leading-tight text-gray-800 dark:text-gray-200">
                    {product.name}
                </span>
            </div>

            {/* Price: Using flex-shrink-0 so price NEVER hides */}
            <span className="text-sm font-bold text-teal-600 dark:text-teal-400 shrink-0">
                {currencySymbol}
                {displayPrice(calculateFinalPrice(product))}
            </span>

            {/* Stock: Simple text */}
            <span
                className={`text-[10px] font-bold mt-0.5 shrink-0 ${isLowStock
                        ? "text-red-500 dark:text-red-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
            >
                {product.stock} in stock
            </span>

            {/* Product Code: mt-auto pushes it to the bottom, px-1 handles horizontal overflow */}
            <span className="mt-auto pt-1 text-[10px] font-medium w-full px-1 shrink-0">
                {product.code || "N/A"}
            </span>
        </button>
    );
};

ProductCard.displayName = "ProductCard";

export default memo(ProductCard);
