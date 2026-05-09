import CommonLayout from "@/layouts/CommonLayout";
import { useLanguage } from "@/contexts/language";
import { PATHS } from "@/routes/paths";
import { useNavigate } from "react-router-dom";
import SystemLogTable from "./SystemLogTable";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/button";

const SystemLogList = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  return (
    <CommonLayout h1={t("navigation.system_log_list_label")}>

      <PageHeader
        subtitle={t("navigation.system_log_list_label")}
        btnLabel={t("common.addNew")}
      >
        <Button
          variant="info"
          onClick={() => navigate(PATHS.SYSTEM_LOG_ADD + "/0")}
          title={t("common.addNew")}
        >
          {t("common.addNew")}
        </Button>
      </PageHeader>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <SystemLogTable />
      </div>
    </CommonLayout>
  );
};
export default SystemLogList;