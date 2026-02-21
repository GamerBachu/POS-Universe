import { NavLink } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { type ISystemLog } from "@/types/systemLog";
import resource from "@/locales/en.json";
import { toDisplayString } from "@/utils/helper/dateUtils";

interface RowProps {
  item: ISystemLog;
}

const SystemLogTableRow = ({ item }: RowProps) => {
  return (
    <tr className="group hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors border-b last:border-0 border-gray-100 dark:border-gray-700/50">

      <td className="p-3 text-xs font-mono text-gray-400 dark:text-gray-500">
        {item.id}
      </td>
      <td className="p-3 text-sm font-medium text-gray-700 dark:text-gray-200">
        {item.type}
      </td>
      <td className="p-3 text-sm font-medium text-gray-700 dark:text-gray-200">
        {item.pageName}
      </td>
      <td className="p-3 text-sm font-medium text-gray-700 dark:text-gray-200">
        {item.functionName}
      </td>
      <td className="p-3 text-sm font-medium text-gray-700 dark:text-gray-200">
        {toDisplayString(item.timestamp)}
      </td>

      <td className="p-3 text-right">
        <div className="inline-flex items-center rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          <NavLink
            to={`${PATHS.SYSTEM_LOG_VIEW}/${item.id}`}
            className="flex items-center px-2.5 py-1 text-xs font-bold uppercase tracking-tight text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors"
          >
            {resource.common.view}
          </NavLink>

          <NavLink
            to={`${PATHS.SYSTEM_LOG_EDIT}/${item.id}`}
            className="flex items-center px-2.5 py-1 text-xs font-bold uppercase tracking-tight text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 border-r border-gray-200 dark:border-gray-700 transition-colors"
          >
            {resource.common.edit}
          </NavLink>

          <NavLink
            to={`${PATHS.SYSTEM_LOG_DELETE}/${item.id}`}
            className="flex items-center px-2.5 py-1 text-xs font-bold uppercase tracking-tight text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          >
            {resource.common.delete}
          </NavLink>
        </div>
      </td>
    </tr>
  );
};

export default SystemLogTableRow;