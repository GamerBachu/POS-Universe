import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import SectionLeft from "./SectionLeft";
import SectionCenter from "./SectionCenter";
import SectionRight from "./SectionRight";
import { useTerminalDispatch } from "./TerminalContext";
import type { IProductView, IProductFilter } from "@/types/product";
import { productsApi } from "@/api/productsApi";
import { generateGuid } from "@/utils/helper/guid";

const TerminalContent = () => {

    const dispatch = useTerminalDispatch();

    const [products, setProducts] = useState<IProductView[]>([]);
    const [filter, setFilter] = useState<IProductFilter>({ isActive: "true", currentPage: 1, pageSize: 20 } as IProductFilter);
    const [inputCode, setInputCode] = useState("");

    // 1. Optimized API Fetching
    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            console.log("filter", filter);
            const res = await productsApi.getFiltered(filter);
            console.log("res", res);
            if (isMounted && res.success && res.data) {
                setProducts(res.data.items);
            }
        };

        const handler = setTimeout(loadData, 200); // Shorter debounce for snappy local DB
        return () => {
            isMounted = false;
            clearTimeout(handler);
        };
    }, [filter]);

    // 3. Stable Handlers
    const handleProductClick = useCallback((product: IProductView) => {
        dispatch({
            type: "ADD_ITEM",
            item: {
                id: 0,
                rowId: generateGuid(),
                product,
                quantity: 1
            }
        });
    }, [dispatch]);

    // 2. Updated handleNumpad
    const handleNumpad = useCallback((val: string) => {
        let nextCode = "";

        if (val === "⌫") {
            nextCode = inputCode.slice(0, -1);
        } else if (val === "↵") {
            // Manual enter: trigger search
            setFilter(prev => ({ ...prev, code: inputCode }));
            return;
        } else {
            nextCode = inputCode + val;
        }

        // Update the buffer
        setInputCode(nextCode);

        // 3. AUTO-ADD LOGIC (Inside the event)
        if (nextCode.length >= 8) {
            const exactMatch = products.find(p => p.code === nextCode);
            if (exactMatch) {
                handleProductClick(exactMatch);
                // Clear everything in one batch
                setInputCode("");
                setFilter(prev => ({ ...prev, code: "" }));
                return; // Exit early so we don't set the filter to the 8-digit code
            }
        }

        // Update the list filter as they type
        setFilter(prev => ({ ...prev, code: nextCode }));

    }, [inputCode, products, handleProductClick]);







    return (
        <div className="flex flex-col h-screen w-screen bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans text-gray-800 dark:text-gray-200">
            <Header label="POS UNIVERSE" />

            <div className="flex flex-1 overflow-hidden border border-gray-200 dark:border-gray-700">
                <SectionLeft />

                <SectionCenter
                    products={products}
                    onProductClick={handleProductClick}
                />

                <SectionRight
                    inputCode={inputCode}
                    setInputCode={setInputCode}

                    onNumpad={handleNumpad}

                    filter={filter}
                    setFilter={setFilter}
                />
            </div>
        </div>
    );
};

export default TerminalContent;