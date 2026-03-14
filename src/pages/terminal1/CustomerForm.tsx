import { useActionState } from "react";
import { useTerminalDispatch, useTerminalState } from "./TerminalContext";
import type { ICustomer } from "@/types/customer";
import type { IActionState } from "@/types/actionState";

interface CustomerFormProps {
    onClose: () => void;
}

const CustomerForm = ({ onClose }: CustomerFormProps) => {
    const dispatch = useTerminalDispatch();
    const { customer: currentCustomer } = useTerminalState();

    const handleAction = async (
        _: IActionState | null,
        formData: FormData,
    ): Promise<IActionState> => {
        const customer: ICustomer = {
            name: (formData.get("name") as string) || "",
            phone: (formData.get("phone") as string) || "",
            email: (formData.get("email") as string) || "",
            address: (formData.get("address") as string) || "",
            createdAt: "",
            id: 0,
        };

        dispatch({ type: "SET_CUSTOMER", customer });
        dispatch({
            type: "SET_ALERT",
            alert: {
                type: "success",
                message: "Save successful",
            },
        });

        onClose();
        return { success: true, message: "Customer saved." };
    };

    // FIX: React 19 useActionState returns [state, action, isPending]
    const [state, formAction, isPending] = useActionState(handleAction, null);

    const handleClear = () => {
        dispatch({ type: "SET_CUSTOMER", customer:s null });
        onClose();
    };
    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-150">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                        <h3 className="font-bold text-xs uppercase tracking-widest text-gray-600 dark:text-gray-300">
                            Customer Profile
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Form Body */}
                <form action={formAction} className="p-4 space-y-3">
                    <div className="space-y-3">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">
                                Full Name
                            </label>
                            <input
                                name="name"
                                defaultValue={currentCustomer?.name}
                                autoFocus
                                placeholder="Guest / Walk-in"
                                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-teal-500"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">
                                Phone
                            </label>
                            <input
                                name="phone"
                                defaultValue={currentCustomer?.phone}
                                placeholder="Contact number"
                                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-teal-500"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">
                                Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                defaultValue={currentCustomer?.email}
                                placeholder="Email address"
                                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-teal-500"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">
                                Address
                            </label>
                            <input
                                name="address"
                                defaultValue={currentCustomer?.address}
                                placeholder="Shipping/Billing address"
                                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-teal-500"
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={handleClear}
                            className="flex-1 py-2 text-[10px] font-black rounded border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all uppercase"
                        >
                            Clear
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-[2] py-2 text-[10px] font-black rounded bg-teal-600 text-white  hover:bg-teal-700 transition-all disabled:opacity-50 uppercase"
                        >
                            {isPending ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerForm;
