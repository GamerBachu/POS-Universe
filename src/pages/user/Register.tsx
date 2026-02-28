import { useActionState } from "react";
import resource from "@/locales/en.json";
import { userApi } from "@/api";
import ThemeToggleIcon from "@/components/ThemeToggleIcon";
import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import AppPurchase from "@/components/AppPurchase";
import LoggerUtils from "@/utils/logger";
import InputWithLabel from "@/components/InputWithLabel";
import Button from "@/components/Button";

// Defined the form interface for strict typing
interface RegisterFormPayload {
    username: string;
    password?: string;
    nameFirst: string;
    nameMiddle: string;
    nameLast: string;
    email: string;
}

interface ActionState {
    success: boolean | null;
    message: string;
}

const Register = () => {
    const loginAction = async (
        prevState: ActionState | null,
        formData: FormData,
    ): Promise<ActionState> => {
        try {
            // Mapping FormData to our interface
            const data: RegisterFormPayload = {
                username: formData.get("email") as string,
                password: formData.get("password") as string,
                nameFirst: formData.get("nameFirst") as string,
                nameMiddle: formData.get("nameMiddle") as string,
                nameLast: formData.get("nameLast") as string,
                email: formData.get("email") as string,
            };

            if (!data.username || !data.password) {
                return {
                    success: false,
                    message: resource.login.invalid_credentials,
                };
            }

            const response = await userApi.postRegister(data);

            if (!response) {
                return { success: false, message: resource.common.error };
            }

            // Handling statuses based on our ServiceResponse structure
            switch (response.status) {
                case 201:
                    return { success: true, message: resource.register.success_message };
                case 409:
                    return { success: false, message: resource.register.userExists };
                case 400:
                    return { success: false, message: resource.login.invalid_credentials };
                default:
                    return { success: false, message: resource.common.error };
            }
        } catch (error: unknown) {
            LoggerUtils.logCatch(error, "Register", "handleAction", "66");
            return { success: false, message: resource.common.error };
        }
    };

    const [state, formAction, isPending] = useActionState(loginAction, null);

    return (
        <div className="flex items-center justify-center p-6 min-h-[inherit]">
            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-md shadow-2xl border border-gray-200 dark:border-gray-700">
                <ThemeToggleIcon className="absolute top-4 right-4" />

                <header className="text-center mb-8">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {resource.register.title}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {resource.register.subtitle}
                    </p>
                </header>

                <form action={formAction} className="space-y-4">
                    <InputWithLabel
                        label={resource.common.name}
                        name="nameFirst"
                        placeholder={resource.common.ph_name}
                        required={true}
                    />

                    <InputWithLabel
                        label={`${resource.common.email}/${resource.common.username}`}
                        type="email"
                        name="email"
                        placeholder={resource.common.ph_email}
                        required={true}
                    />

                    <InputWithLabel
                        label={resource.common.password}
                        type="password"
                        name="password"
                        placeholder={resource.common.ph_password}
                        required={true}
                    />

                    {state?.message && (
                        <div
                            role="alert"
                            className={`p-3 rounded-sm text-sm text-center font-medium animate-in fade-in duration-300 ${state.success ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800" : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800"
                                }`}
                        >
                            {state.message}
                        </div>
                    )}

                    <div className="flex flex-col gap-3 pt-4">
                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                            disabled={isPending}
                            isLoading={isPending}
                        >
                            {resource.register.submit}
                        </Button>
                        <Link
                            to={PATHS.LOGIN}
                            className="w-full text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline transition-all text-center"
                        >
                            {resource.login.submit}
                        </Link>
                    </div>
                    <AppPurchase />
                </form>
            </div>
        </div>
    );
};

export default Register;
