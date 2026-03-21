import { useActionState, useEffect } from "react";
import { useTerminalDispatch, useTerminalState } from "./TerminalContext";
import type { ICustomer } from "@/types/customer";
import type { IActionState } from "@/types/actionState";
import { CloseIcon } from "@/libs/icons";
import resource from "@/locales/en.json";

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
                message: resource.pos_t1.success_save,
            },
        });

        onClose();
        return { success: true, message: resource.pos_t1.msg_customer_saved };
    };
    // Keyboard Shortcuts Logic
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    // FIX: React 19 useActionState returns [state, action, isPending]
    const [_, formAction, isPending] = useActionState(handleAction, null);

    const handleClear = () => {
        dispatch({ type: "SET_CUSTOMER", customer: null });
        onClose();
    };
    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[1px]">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-150">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                        <h3 className="font-bold text-xs uppercase tracking-widest text-gray-600 dark:text-gray-300">
                            {resource.pos_t1.customer_profile}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500"
                    >
                        <CloseIcon className="w-4 h-4" />
                    </button>
                </div>

                {/* Form Body */}
                <form action={formAction} className="p-4 space-y-3">
                    <div className="space-y-3">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">
                                {resource.pos_t1.full_name}
                            </label>
                            <input
                                name="name"
                                defaultValue={currentCustomer?.name}
                                autoFocus
                                placeholder={resource.pos_t1.ph_guest_walk_in}
                                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-teal-500"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">
                                {resource.pos_t1.phone}
                            </label>
                            <input
                                name="phone"
                                defaultValue={currentCustomer?.phone}
                                placeholder={resource.pos_t1.ph_contact_number}
                                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-teal-500"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">
                                {resource.pos_t1.email}
                            </label>
                            <input
                                name="email"
                                type="email"
                                defaultValue={currentCustomer?.email}
                                placeholder={resource.pos_t1.ph_email}
                                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-teal-500"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">
                                {resource.pos_t1.address}
                            </label>
                            <input
                                name="address"
                                defaultValue={currentCustomer?.address}
                                placeholder={resource.pos_t1.ph_address}
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
                            {resource.pos_t1.clear}
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-[2] py-2 text-[10px] font-black rounded bg-teal-600 text-white  hover:bg-teal-700 transition-all disabled:opacity-50 uppercase"
                        >
                            {isPending ? resource.pos_t1.saving : resource.pos_t1.save}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerForm;
