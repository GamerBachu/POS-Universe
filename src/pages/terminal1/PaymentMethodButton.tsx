
const PaymentMethodButton = ({ children, active = false }: { children: React.ReactNode; active?: boolean; }) => (
    <button className={`flex-1 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm text-[10px] font-bold uppercase hover:bg-teal-500 hover:text-white transition-all ${active ? "" : ""}`}>
        {children}
    </button>
);

export default PaymentMethodButton;