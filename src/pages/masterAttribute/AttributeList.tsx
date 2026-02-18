import CommonLayout from "@/layouts/CommonLayout";
import resource from "@/locales/en.json";
import { PATHS } from "@/routes/paths";
import { Link } from "react-router-dom";
import AttributeTable from "./AttributeTable";

const AttributeList = () => {
    return (
        <CommonLayout h1={resource.navigation.master_pro__attr_label}>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold"></h1>
                <Link
                    to={PATHS.MASTER_ATTRIBUTE_ADD + "/0"}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-sm"
                >
                    {resource.common.btnAdd}
                </Link>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
                <AttributeTable />
            </div>
        </CommonLayout>
    );
};

export default AttributeList;