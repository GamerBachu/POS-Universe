type ActionStatusMessageProps = {
  message?: string;
  success: boolean;
};

export const ActionStatusMessage = ({ message, success }: ActionStatusMessageProps) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`p-2 rounded text-sm text-center font-medium border ${success
        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/10 dark:text-green-400 dark:border-green-900"
        : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900"
        }`}
    >
      {message}
    </div>
  );
};
