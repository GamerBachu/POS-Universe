import CommonLayout from "@/layouts/CommonLayout";
import { useTranslation } from "@/contexts/language";
import { PATHS } from "@/routes/paths";
import { useNavigate } from "react-router-dom";
import SystemLogTable from "./SystemLogTable";
import PageHeader from "@/components/PageHeader";

const SystemLogList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <CommonLayout h1={t("navigation.system_log_list_label")}> 

      <PageHeader
        subtitle={undefined}
        btnClass="bg-green-600 hover:bg-green-700"
        btnLabel={t("common.addNew")}
        onClick={() => navigate(PATHS.SYSTEM_LOG_ADD + "/0")}
      />

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <SystemLogTable />
      </div>
    </CommonLayout>
  );
};
export default SystemLogList;