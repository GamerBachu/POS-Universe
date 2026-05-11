import { NavLink } from "react-router-dom";

interface Action {
    label: string;
    path: string;
    variant?: "default" | "primary" | "danger";
}

interface ActionGroupButtonProps {
    itemId: string | number;
    actions: Action[];
}

export const ActionGroupButton = ({ actions }: ActionGroupButtonProps) => {
    const getVariantClasses = (variant?: string) => {
        switch (variant) {
            case "primary":
                return "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30";
            case "danger":
                return "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30";
            default:
                return "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800";
        }
    };

    return (
        <div className="inline-flex items-center rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
            {actions.map((action, index) => (
                <NavLink
                    key={action.path}
                    to={action.path}
                    className={`flex items-center px-2.5 py-1 text-sm font-bold uppercase tracking-tight transition-colors
            ${getVariantClasses(action.variant)}
            ${index !== actions.length - 1 ? "border-r border-gray-200 dark:border-gray-700" : ""}
          `}
                >
                    {action.label}
                </NavLink>
            ))}
        </div>
    );
}; 
