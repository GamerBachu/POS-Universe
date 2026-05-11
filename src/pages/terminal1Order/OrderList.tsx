import CommonLayout from "@/layouts/CommonLayout";
import { useLanguage } from "@/contexts/language";
import { PATHS } from "@/routes/paths";
import { useNavigate } from "react-router-dom";
import OrderTable from "./OrderTable";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/button";

const OrderList: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    return (
        <CommonLayout h1={t("navigation.terminal1_order_label")}>
            <PageHeader subtitle={undefined} btnLabel={t("common.addNew")}>
                <Button
                    variant="info"
                    onClick={() => navigate(PATHS.TERMINAL_1_POS)}
                    title={t("common.addNew")}
                >
                    {t("common.addNew")}
                </Button>
            </PageHeader>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
                <OrderTable />
            </div>
        </CommonLayout>
    );
};
export default OrderList;
