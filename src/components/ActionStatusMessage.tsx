import type { IStatusType } from "@/types/actionState";


type ActionStatusMessageProps = {
  message?: string | null;
  type?: IStatusType;
};

const statusStyles: Record<IStatusType, string> = {
  success: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/10 dark:text-green-400 dark:border-green-800",
  error: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/10 dark:text-red-400 dark:border-red-800",
  warning: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/10 dark:text-amber-400 dark:border-amber-800",
  info: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-800",
};

export const ActionStatusMessage = ({
  message,
  type = "info"
}: ActionStatusMessageProps) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`flex items-center justify-center gap-2 p-2 rounded text-sm font-medium border ${statusStyles[type]}`}
    >

      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        {type === "success" && <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />}
        {type === "error" && <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />}
        {type === "warning" && <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />}
        {type === "info" && <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
      </svg>
      <span>{message}</span>
    </div>
  );
};


export const AlertSuccess = ({ message }: { message?: string | null; }) => (
  <ActionStatusMessage message={message} type="success" />
);

export const AlertError = ({ message }: { message?: string | null; }) => (
  <ActionStatusMessage message={message} type="error" />
);

export const AlertWarning = ({ message }: { message?: string | null; }) => (
  <ActionStatusMessage message={message} type="warning" />
);

export const AlertInfo = ({ message }: { message?: string | null; }) => (
  <ActionStatusMessage message={message} type="info" />
);