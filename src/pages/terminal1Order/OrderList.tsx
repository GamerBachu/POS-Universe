import CommonLayout from "@/layouts/CommonLayout";
import { useLanguage } from "@/contexts/language";
import { PATHS } from "@/routes/paths";
import { useNavigate } from "react-router-dom";
import OrderTable from "./OrderTable";
import PageHeader from "@/components/PageHeader";

const OrderList: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    return (
        <CommonLayout h1={t("navigation.terminal1_order_label")}>
            <PageHeader
                subtitle={undefined}
                btnClass="bg-green-600 hover:bg-green-700"
                btnLabel={t("common.addNew")}
                onClick={() => navigate(PATHS.TERMINAL_1_ADD + "/0")}
            />

            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
                <OrderTable />
            </div>
        </CommonLayout>
    );
};
export default OrderList;
