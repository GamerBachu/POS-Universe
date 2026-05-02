import { PATHS } from "@/routes/paths";
import { type IMasterProductAttribute } from "@/types/masters";
import { useLanguage } from "@/contexts/language";
import Status from "@/components/badge/Status";
import { ActionGroupButton } from "@/components/button";

interface RowProps {
    item: IMasterProductAttribute;
}

const AttributeTableRow = ({ item }: RowProps) => {
    const { t } = useLanguage();
    return (
        <tr className="group hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors border-b last:border-0 border-gray-100 dark:border-gray-700/50">

            <td className="p-3 text-xs font-mono text-gray-400 dark:text-gray-500">
                {item.id}
            </td>


            <td className="p-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                <span className="truncate block max-w-[200px]" title={item.name}>
                    {item.name}
                </span>
            </td>

            <td className="p-3 text-center">
                <Status isActive={item.isActive}>
                    {item.isActive ? t("common.active") : t("common.inactive")}
                </Status>
            </td>


            <td className="p-3 text-right">
                <ActionGroupButton
                    itemId={item.id}
                    actions={[
                        {
                            label: t("common.view"),
                            path: `${PATHS.MASTER_ATTRIBUTE_VIEW}/${item.id}`
                        },
                        {
                            label: t("common.edit"),
                            path: `${PATHS.MASTER_ATTRIBUTE_VIEW}/${item.id}`,
                            variant: 'primary'
                        },
                        {
                            label: t("common.delete"),
                            path: `${PATHS.MASTER_ATTRIBUTE_VIEW}/${item.id}`,
                            variant: 'danger'
                        },
                    ]}
                />
            </td>
        </tr>
    );
};

export default AttributeTableRow;