import React, { useActionState, useCallback, useEffect, useMemo } from "react";
import resource from "@/locales/en.json";
import { userApi } from "@/api";
import ThemeToggleIcon from "@/components/ThemeToggleIcon";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isValidPath, PATHS } from "@/routes/paths";
import { useAuth } from "@/contexts/authorize";
import type { IAuthUser, IAuthResponse } from "@/types/user";
import { getName } from "@/utils";
import type { IAuthorize } from "@/contexts/authorize/type";
import type { IActionState } from "@/types/actionState";
import LoggerUtils from "@/utils/logger";
import InputWithLabel from "@/components/InputWithLabel";
import { Button } from "@/components/Button";
import { AlertError, AlertSuccess } from "@/components/ActionStatusMessage";



const Login: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const loginAction = async (
    prevState: IActionState | null,
    formData: FormData,
  ): Promise<IActionState> => {
    try {
      const username = formData.get("username") as string;
      const password = formData.get("password") as string;

      if (!username || !password) {
        return { success: false, message: resource.login.invalid_credentials };
      }
      const response = await userApi.postLogin(username, password);

      if (!response) {
        return { success: false, message: resource.common.error };
      }

      // Handling statuses based on our ServiceResponse structure
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

          return { success: true, message: resource.login.success_message };
        }
        case 400:
        case 401:
        case 404:
          return { success: false, message: resource.login.invalid_credentials };
        default:
          return { success: false, message: resource.common.error };
      }
    } catch (error: unknown) {
      LoggerUtils.logCatch(error, "Login", "handleAction", "76");
      return {
        success: false,
        message: resource.common.error,
      };
    }
  };

  const [state, formAction, isPending] = useActionState(loginAction, null);

  const AUTH_PATHS = useMemo(() => new Set([
    "/",
    PATHS.LOGIN,
    PATHS.REGISTER,
    PATHS.LOGOUT,
    PATHS.ERROR,
    PATHS.VERIFY
  ]), []);

  const getSafeRedirectUrl = useCallback(() => {
    const from = location.state?.from;
    const fromUrl = from?.pathname;

    if (!fromUrl || AUTH_PATHS.has(fromUrl) || !isValidPath(fromUrl)) {
      return PATHS.START;
    }

    return fromUrl + (from?.search || "");
  }, [AUTH_PATHS, location]);

  useEffect(() => {
    if (state === null) return;
    else if (state.success === false) return;
    else {
      navigate(getSafeRedirectUrl(), { replace: true });
    }
  }, [state, navigate, getSafeRedirectUrl]);
  console.log("Login render", state);
  return (
    <div className="flex items-center justify-center p-6 min-h-[inherit]">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-md shadow-2xl border border-gray-200 dark:border-gray-700">
        <ThemeToggleIcon className="absolute top-4 right-4" />
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            {resource.login.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {resource.login.subtitle}
          </p>
        </header>

        <form action={formAction} className="space-y-4">
          <InputWithLabel
            label={resource.common.username}
            name="username"
            placeholder={resource.common.ph_username}
            required={true}
          />

          <InputWithLabel
            label={resource.common.password}
            type="password"
            name="password"
            placeholder={resource.common.ph_password}
            required={true}
          />

          {(state?.success === true) && <AlertSuccess message={state?.message} />}
          {(state?.success === false) && <AlertError message={state?.message} />}

          <div className="flex flex-col gap-3 pt-4">
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={isPending}
              isLoading={isPending}
            >
              {resource.login.submit}
            </Button>
            <Link
              to={PATHS.REGISTER}
              className="w-full text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline transition-all text-center"
            >
              {resource.login.register}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
