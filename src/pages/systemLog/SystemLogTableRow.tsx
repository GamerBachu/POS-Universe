import { PATHS } from "@/routes/paths";
import { type ISystemLog } from "@/types/systemLog";
import { useLanguage } from "@/contexts/language";
import { toDisplayString } from "@/utils/helper/dateUtils";
import { ActionGroupButton } from "@/components/button";

interface RowProps {
  item: ISystemLog;
}

const SystemLogTableRow = ({ item }: RowProps) => {
  const { t } = useLanguage();
  return (
    <tr className="group hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors border-b last:border-0 border-gray-100 dark:border-gray-700/50">

      <td className="p-3 text-sm font-mono text-gray-400 dark:text-gray-500">
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
        <ActionGroupButton
          itemId={item.id}
          actions={[
            {
              label: t("common.view"),
              path: `${PATHS.SYSTEM_LOG_VIEW}/${item.id}`
            },
            {
              label: t("common.edit"),
              path: `${PATHS.SYSTEM_LOG_EDIT}/${item.id}`,
              variant: 'primary'
            },
            {
              label: t("common.delete"),
              path: `${PATHS.SYSTEM_LOG_DELETE}/${item.id}`,
              variant: 'danger'
            },
          ]}
        />

      </td>
    </tr>
  );
};

export default SystemLogTableRow;