import { useActionState } from "react";
import { useLanguage } from "@/contexts/language";
import { userApi } from "@/api";
import ThemeToggleIcon from "@/components/ThemeToggleIcon";
import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import AppPurchase from "@/components/AppPurchase";
import LoggerUtils from "@/utils/logger";
import { AlertError, AlertSuccess } from "@/components/ActionStatusMessage";
import { TextBoxWithLabel } from "@/components/input";
import type { IFormState } from "@/types/actionState";
import type { IRegisterForm } from "@/types/user";
import { SubmitButton } from "@/components/button";

const Register = () => {
    const { t } = useLanguage();
    const formActionAsync = async (
        _prevState: IFormState<IRegisterForm>,
        formData: FormData,
    ): Promise<IFormState<IRegisterForm>> => {
        try {
            // Mapping FormData to our interface
            const data: IRegisterForm = {
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
                    message: t("login.invalid_credentials"),
                    errors: {
                        username: !data.username ? [t("common.required")] : [],
                        password: !data.password ? [t("common.required")] : [],
                    },

                };
            }

            const response = await userApi.postRegister(data);

            if (!response) {
                return {
                    success: false,
                    message: t("common.error"),
                    errors: null,

                };
            }

            // Handling statuses based on our ServiceResponse structure
            switch (response.status) {
                case 201:
                    return {
                        success: true,
                        message: t("register.success_message"),
                        errors: null,
                    };
                case 409: return {
                    success: false,
                    message: t("register.userExists"),
                    errors: {
                        username: [t("register.userExists")],
                    },
                };
                case 400:
                    return {
                        success: false,
                        message: t("login.invalid_credentials"),
                        errors: {
                            username: [t("login.invalid_credentials")],
                            password: [t("login.invalid_credentials")],
                        },
                    };
                default:
                    return {
                        success: false,
                        message: t("common.error"),
                        errors: null,
                    };
            }
        } catch (error: unknown) {
            LoggerUtils.logCatch(error, "Register", "handleAction", "66");
            return {
                success: false,
                message: t("common.error"),
                errors: null,
            };
        }
    };

    const [state, formAction, isPending] = useActionState(formActionAsync, {
        success: false,
        message: null,
        errors: null,

    });

    return (
        <div className="flex items-center justify-center p-6 min-h-[inherit]">
            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-md shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="absolute top-4 right-4"><ThemeToggleIcon /></div>

                <header className="text-center mb-8">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {t("register.title")}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t("register.subtitle")}
                    </p>
                </header>

                <form action={formAction} className="space-y-4">

                    <TextBoxWithLabel
                        label={t("common.name")}
                        name="nameFirst"
                        placeholder={t("common.ph_name")}
                        disabled={isPending}
                        error={state.errors?.username?.[0]}
                        required
                    />
                    <TextBoxWithLabel
                        label={`${t("common.email")}/${t("common.username")}`}
                        type="email"
                        name="email"
                        placeholder={t("common.ph_email")}
                        disabled={isPending}
                        error={state.errors?.email?.[0]}
                        required
                    />
                    <TextBoxWithLabel
                        label={t("common.password")}
                        type="password"
                        name="password"
                        placeholder={t("common.ph_password")}
                        disabled={isPending}
                        error={state.errors?.password?.[0]}
                        required
                    />
                    {state.message &&
                        (state.success ? (
                            <AlertSuccess message={state.message} />
                        ) : (
                            <AlertError message={state.message} />
                        ))}

                    <div className="flex flex-col gap-3 pt-4">

                        <SubmitButton
                            isLoading={isPending}
                            disabled={isPending}
                        >
                            {t("register.submit")}
                        </SubmitButton>

                        <Link
                            to={PATHS.LOGIN}
                            className="w-full text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline transition-all text-center"
                        >
                            {t("login.submit")}
                        </Link>
                    </div>
                    <AppPurchase />
                </form>
            </div>
        </div>
    );
};

export default Register;
