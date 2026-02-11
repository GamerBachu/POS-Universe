import React, { useActionState } from "react";
import resource from "@/locales/en.json";
import { userApi } from "@/api";
import ThemeToggleIcon from "@/components/ThemeToggleIcon";

interface ActionState {
  success: boolean | null;
  message: string;
}

const Login: React.FC = () => {
  const loginAction = async (
    prevState: ActionState | null,
    formData: FormData,
  ): Promise<ActionState> => {
    try {
      const username = formData.get("username") as string;
      const password = formData.get("password") as string;

      if (!username || !password) {
        return { success: false, message: resource.login.invalidCredentials };
      }
      const response = await userApi.postLogin(username, password);
      if (response) {
        return { success: true, message: resource.login.successMessage };
      }
      return { success: false, message: resource.login.invalidCredentials };
    } catch {
      return { success: false, message: resource.common.error };
    }
  };

  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="flex items-center justify-center p-6 min-h-[inherit]">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-md shadow-2xl border border-gray-200 dark:border-gray-700">
        <ThemeToggleIcon
          className="absolute top-4 right-4" />
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            {resource.login.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {resource.login.subtitle}
          </p>
        </header>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
              {resource.common.usernameLabel}
            </label>
            <input
              type="text"
              name="username"
              required
              className="w-full px-4 py-2 rounded-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder={resource.common.usernamePlaceholder}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
              {resource.common.passwordLabel}
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2 rounded-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder={resource.common.passwordPlaceholder}
            />
          </div>

          {state?.message && (
            <div
              role="alert"
              className={`p-3 rounded-sm text-sm text-center font-medium animate-in fade-in duration-300 ${state.success === true
                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800"
                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800"
                }`}
            >
              {state.message}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-sm transition-transform active:scale-95 disabled:opacity-70"
              disabled={isPending}
            >
              {isPending ? `${resource.login.submit}...` : resource.login.submit}
            </button>
            <button
              type="button"
              className="w-full text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline transition-all"
            >
              {resource.login.register}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;