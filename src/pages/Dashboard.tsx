import CommonLayout from "@/layouts/CommonLayout";
import { useLanguage } from "@/contexts/language";
import RecentTransactions from "./reports/RecentTransactions";
import TopSelling from "./reports/TopSelling";
import InventoryAlerts from "./reports/InventoryAlerts";
import PaymentMix from "./reports/PaymentMix";
import HourlyHeatmap from "./reports/HourlyHeatmap";

const Dashboard = () => {
    const { t } = useLanguage();
    return (
        <CommonLayout h1={t("navigation.dashboard_label")}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 my-3">
                <TopSelling></TopSelling>

                <InventoryAlerts></InventoryAlerts>

                <PaymentMix></PaymentMix>

                <HourlyHeatmap></HourlyHeatmap>

                <RecentTransactions></RecentTransactions>
            </div>
        </CommonLayout>
    );
};

export default Dashboard;
