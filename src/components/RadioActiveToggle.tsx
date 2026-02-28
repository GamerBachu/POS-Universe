
type RadioActiveToggleProps = {
    isActive: boolean;
    isReadOnly: boolean;
    title: string;
    desc: string;
    name: string;
};

export const RadioActiveToggle = ({
    isActive,
    isReadOnly,
    title,
    desc,
    name
}: RadioActiveToggleProps) => {
    return (
        <label
            htmlFor={name}
            className={`flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 ${!isReadOnly ? "cursor-pointer" : ""}`}
        >
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {title}
                </span>
                <span className="text-sm text-gray-500">
                    {desc}
                </span>
            </div>

            <div className="relative inline-flex items-center">
                <input
                    type="checkbox"
                    id={name}
                    name={name}
                    disabled={isReadOnly}
                    defaultChecked={isActive}
                    key={`active-${isActive}`}
                    className="sr-only peer"
                />
                <div className="w-11 h-6 rounded-full peer bg-red-200 dark:bg-red-900/40 peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none disabled:opacity-50"></div>
            </div>
        </label>
    );
};

export default RadioActiveToggle;