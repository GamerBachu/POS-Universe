type ProductCardProps = {
    name: string;
    price: string;
};

const ProductCard = ({
    name,
    price,
}: ProductCardProps) => {
    return (
        <button className="group flex flex-col bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-teal-500 hover:shadow-lg transition-all text-center active:scale-95">
            <div className="aspect-square bg-gray-100 dark:bg-gray-700/50 rounded-md mb-3 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            </div>
            <span className="text-sm font-semibold line-clamp-2 mb-1">{name}</span>
            <span className="text-sm font-bold text-teal-600 dark:text-teal-400">{price}</span>
        </button>
    );

};

export default ProductCard;