
interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode;
}
export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
    children,
    icon,
    className = "",
    ...props
}) => {
    return (
        <button
            type="button"
            className={`relative flex items-center justify-center gap-2 w-full py-2.5 px-2.5 rounded-md font-bold uppercase text-sm tracking-wider transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed bg-gray-600 hover:bg-gray-700 text-white dark:bg-zinc-700 dark:hover:bg-zinc-600 ${className}`}
            {...props}
        >
            <span className="flex items-center gap-2">
                {icon && <span className="text-lg">{icon}</span>}
                {children || "Cancel"}
            </span>
        </button>
    );
};