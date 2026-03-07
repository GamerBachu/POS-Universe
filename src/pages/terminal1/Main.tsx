import React, { useEffect } from "react";
import Header from "@/components/Header";
import SectionLeft from "./SectionLeft";
import SectionCenter from "./SectionCenter";
import SectionRight from "./SectionRight";
import { TerminalProvider, useTerminalState, useTerminalDispatch } from "./TerminalContext";

const dummyProducts = [
    { id: "101", name: "Wireless Mouse", price: 50, code: "WM01" },
    { id: "102", name: "Bluetooth Keyboard", price: 80, code: "BK02" },
    { id: "103", name: "USB-C Hub", price: 35, code: "UH03" },
    { id: "104", name: "Laptop Stand", price: 60, code: "LS04" },
    { id: "105", name: "Monitor", price: 200, code: "MN05" },
    { id: "106", name: "Desk Lamp", price: 25, code: "DL06" },
    { id: "107", name: "Notebook", price: 10, code: "NB07" },
    { id: "108", name: "Pen Set", price: 15, code: "PS08" },
    { id: "109", name: "Headphones", price: 120, code: "HP09" },
    { id: "110", name: "Webcam", price: 70, code: "WC10" },
];

const TerminalContent = () => {
    const state = useTerminalState();
    const dispatch = useTerminalDispatch();
    const [inputCode, setInputCode] = React.useState("");
    const [filter, setFilter] = React.useState("");


    // Filtered products for center section
    const filteredProducts = React.useMemo(() => {
        if (!filter) return dummyProducts;
        return dummyProducts.filter(
            p => p.code.toLowerCase().includes(filter.toLowerCase()) || p.name.toLowerCase().includes(filter.toLowerCase())
        );
    }, [filter]);

    // Add product to cart
    const handleProductClick = (product: typeof dummyProducts[0]) => {
        dispatch({ type: "ADD_ITEM", item: { id: product.id, name: product.name, price: product.price } });
    };

    // Handle numpad input for product code
    const handleNumpad = (val: string) => {
        if (val === "⌫") {
            setInputCode(prev => prev.slice(0, -1));
        } else if (val === "↵") {
            setFilter(inputCode);
        } else {
            setInputCode(prev => prev + val);
        }
    };
    useEffect(() => {
        setFilter(inputCode);
    }, [inputCode]);

    // Payment method
    const setPaymentMethod = (method: string) => {
        dispatch({ type: "SET_PAYMENT_METHOD", method });
    };

    // Cart total
    const cartTotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans text-gray-800 dark:text-gray-200">
            <Header label={"h1"}></Header>
            {/* Removed TerminalContent demo UI */}
            <div className="flex flex-1 overflow-hidden border border-gray-200 dark:border-gray-700">
                <SectionLeft cart={state.cart} total={cartTotal} />
                <SectionCenter products={filteredProducts} onProductClick={handleProductClick} />
                <SectionRight
                    inputCode={inputCode}
                    onNumpad={handleNumpad}
                    onSetPayment={setPaymentMethod}
                    cartTotal={cartTotal}
                    filter={filter}
                    setInputCode={setInputCode}
                />
            </div>
        </div>
    );
};

const Main = () => {
    return (<TerminalProvider>
        <TerminalContent></TerminalContent>
    </TerminalProvider>
    );
};


export default Main;