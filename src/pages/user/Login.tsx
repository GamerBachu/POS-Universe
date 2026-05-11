import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLanguage } from "@/contexts/language";
import { userApi } from "@/api";
import ThemeToggleIcon from "@/components/ThemeToggleIcon";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isValidPath, PATHS } from "@/routes/paths";
import { useAuth } from "@/contexts/authorize";
import type { IAuthUser, IAuthResponse, ILoginForm } from "@/types/user";
import { getName } from "@/utils";
import type { IAuthorize } from "@/contexts/authorize/type";
import LoggerUtils from "@/utils/logger";
import { AlertError, AlertSuccess } from "@/components/ActionStatusMessage";
import { TextBoxWithLabel } from "@/components/input";
import type { IFormState } from "@/types/actionState";
import { Button, } from "@/components/button";

const Login: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  // We use a formKey to force-reset the uncontrolled inputs
  const [formKey, setFormKey] = useState(0);

  const formActionAsync = async (
    _prevState: IFormState<ILoginForm>,
    formData: FormData,
  ): Promise<IFormState<ILoginForm>> => {
    // Capture current key to sync state with the form instance
    const currentKey = formKey;
    try {
      const username = formData.get("username") as string;
      const password = formData.get("password") as string;

      if (!username || !password) {
        return {
          success: false,
          message: t("login.invalid_credentials"),
          errors: {
            username: !username ? [t("common.required")] : [],
            password: !password ? [t("common.required")] : [],
          },
          formVersion: currentKey,
        };
      }
      const response = await userApi.postLogin(username, password);

      if (!response) {
        return {
          success: false,
          message: t("common.error"),
          errors: null,
          formVersion: currentKey,
        };
      }

      switch (response.status) {
        case 200: {
          const { user, token } = response.data as IAuthResponse;
          const authUser: IAuthUser = {
            userId: user.id,
            displayName: getName(
              user.nameFirst,
              user.nameMiddle,
              user.nameLast,
            ),
            username: user.username,
            roles: [],
            refreshToken: token.token,
          };

          const info: IAuthorize = {
            authUser,
            isAuthorized: true,
          };

          auth.setInfo(info);
          return {
            success: true,
            message: t("login.success_message"),
            errors: null,
            formVersion: currentKey,
          };
        }
        case 400:
        case 401:
        case 404:
          return {
            success: false,
            message: t("login.invalid_credentials"),
            errors: {
              username: [t("login.invalid_credentials")],
              password: [t("login.invalid_credentials")],
            },
            formVersion: currentKey,
          };
        default:
          return {
            success: false,
            message: t("common.error"),
            errors: null,
            formVersion: currentKey,
          };
      }
    } catch (error: unknown) {
      LoggerUtils.logCatch(error, "Login", "handleAction", "76");
      return {
        success: false,
        message: t("common.error"),
        errors: null,
        formVersion: currentKey,
      };
    }
  };

  const [state, action, isPending] = useActionState(formActionAsync, {
    success: false,
    message: null,
    errors: null,
    formVersion: 0,
  });

  const handleReset = () => {
    setFormKey((prev) => prev + 1);
    // Clears input fields
    // Optional: You can't easily clear 'state' from useActionState manually,
    // but resetting the key clears the visual errors on the inputs.
  };

  const AUTH_PATHS = useMemo(
    () =>
      new Set([
        "/",
        PATHS.LOGIN,
        PATHS.REGISTER,
        PATHS.LOGOUT,
        PATHS.ERROR,
        PATHS.VERIFY,
      ]),
    [],
  );

  const getSafeRedirectUrl = useCallback(() => {
    const from = location.state?.from;
    const fromUrl = from?.pathname;

    if (!fromUrl || AUTH_PATHS.has(fromUrl) || !isValidPath(fromUrl)) {
      return PATHS.START;
    }

    return fromUrl + (from?.search || "");
  }, [AUTH_PATHS, location]);

  useEffect(() => {
    if (state?.success) {
      navigate(getSafeRedirectUrl(), { replace: true });
    }
  }, [state, navigate, getSafeRedirectUrl]);

  //  In your JSX, only show errors/alerts if they match the CURRENT formKey
  const isStateCurrent = state.formVersion === formKey;
  return (
    <div className="flex items-center justify-center p-6 min-h-[inherit]">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-md shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="absolute top-4 right-4">
          <ThemeToggleIcon />
        </div>

        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            {t("login.title")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t("login.subtitle")}
          </p>
        </header>
        <form key={formKey} action={action} className="space-y-4">
          <TextBoxWithLabel
            label={t("common.username")}
            name="username"
            placeholder={t("common.ph_username")}
            disabled={isPending}
            error={isStateCurrent ? state.errors?.username?.[0] : undefined}
            required
          />

          <TextBoxWithLabel
            label={t("common.password")}
            type="password"
            name="password"
            placeholder={t("common.ph_password")}
            disabled={isPending}
            error={isStateCurrent ? state.errors?.password?.[0] : undefined}
            required
          />

          {isStateCurrent &&
            state.message &&
            (state.success ? (
              <AlertSuccess message={state.message} />
            ) : (
              <AlertError message={state.message} />
            ))}

          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-4">
              <Button
                variant="secondary"
                onClick={handleReset}
                disabled={isPending}
                className="w-1/2 uppercase"
                title={t("common.reset")}
              >
                {t("common.reset")}
              </Button>

              <Button
                variant="primary"
                type="submit"
                isLoading={isPending}
                disabled={isPending}
                className="w-1/2 uppercase"
                title={t("login.submit")}
              >
                {t("login.submit")}
              </Button>
            </div>

            <div className="text-center">
              <Link
                to={PATHS.REGISTER}
                className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline transition-all"
              >
                {t("login.register")}
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
