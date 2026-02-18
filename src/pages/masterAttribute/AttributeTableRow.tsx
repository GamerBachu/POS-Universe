import { NavLink } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { type IMasterProductAttribute } from "@/types/masters";
import resource from "@/locales/en.json";

interface RowProps {
    item: IMasterProductAttribute;
}

const AttributeTableRow = ({ item }: RowProps) => {
    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <td className="p-3 text-sm font-mono text-gray-500">{item.id}</td>
            <td className="p-3 text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {item.name}
            </td>
            <td className="p-3 text-sm text-center">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${item.isActive
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                    {item.isActive ? resource.common.active : resource.common.inactive}
                </span>
            </td>
            <td className="p-3 text-right">
                <div className="inline-flex items-center rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
                    <NavLink to={`${PATHS.MASTER_ATTRIBUTE_VIEW}/${item.id}`} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 border-r border-gray-200 dark:border-gray-600" title="View">🔍</NavLink>
                    <NavLink to={`${PATHS.MASTER_ATTRIBUTE_EDIT}/${item.id}`} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 border-r border-gray-200 dark:border-gray-600" title="Edit">✏️</NavLink>
                    <NavLink to={`${PATHS.MASTER_ATTRIBUTE_DELETE}/${item.id}`} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500" title="Delete">🗑️</NavLink>
                </div>
            </td>
        </tr>
    );
};

export default AttributeTableRow;