import CommonLayout from "@/layouts/CommonLayout";
import resource from "@/locales/en.json";
import { PATHS } from "@/routes/paths";
import { Link } from "react-router-dom";
import SystemLogTable from "./SystemLogTable";

const SystemLogList = () => {
  return (
    <CommonLayout h1={resource.navigation.system_log_list_label}>
      <div className="flex justify-end items-center mb-4">
        <Link
          to={PATHS.SYSTEM_LOG_ADD + "/0"}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-sm"
        >
          {resource.common.add}
        </Link>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <SystemLogTable />
      </div>
    </CommonLayout>
  );
};
export default SystemLogList;