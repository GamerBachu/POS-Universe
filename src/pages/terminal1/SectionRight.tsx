import type { IProductFilter } from "@/types/product";
import ProductSearch from "./ProductSearch";
import CustomerLink from "./CustomerLink";
import PaymentProcess from "./PaymentProcess";
type Props = {
    inputCode: string;
    onInputType: (val: string) => void;
    onNumpad: (val: string) => void;
    filter: IProductFilter;
    setFilter: (val: IProductFilter) => void;
    resetFilter: () => void;
};

const SectionRight = ({
    inputCode,
    onInputType,
    onNumpad,
    filter,
    setFilter,
    resetFilter,
}: Props) => {
    return (
        <section className="w-72 h-full flex flex-col bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <ProductSearch
                    inputCode={inputCode}
                    onInputType={onInputType}
                    onNumpad={onNumpad}
                    filter={filter}
                    setFilter={setFilter}
                />
            </div>
            <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <CustomerLink />
                <PaymentProcess
                    resetFilter={resetFilter}
                />
            </div>
        </section>
    );
};

export default SectionRight;
