
import type { IProductFilter } from "@/types/product";
import ProductSearch from "./ProductSearch";
import User from "./User";
import ProductPayment from "./ProductPayment";

type Props = {
    inputCode: string;
    onInputType: (val: string) => void;
    onNumpad: (val: string) => void;
    filter: IProductFilter;
    setFilter: (val: IProductFilter) => void;
};

const SectionRight = ({ inputCode, onInputType, onNumpad, filter, setFilter }: Props) => {


    return (
        <section className="w-72 flex flex-col bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 relative">
            <ProductSearch
                inputCode={inputCode}
                onInputType={onInputType}
                onNumpad={onNumpad}
                filter={filter}
                setFilter={setFilter}
            ></ProductSearch>
            <User></User>
            <ProductPayment></ProductPayment>
        </section>
    );
};

export default SectionRight;