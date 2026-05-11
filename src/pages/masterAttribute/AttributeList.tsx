import CommonLayout from "@/layouts/CommonLayout";
import { useLanguage } from "@/contexts/language";
import { PATHS } from "@/routes/paths";
import { useNavigate } from "react-router-dom";
import AttributeTable from "./AttributeTable";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/button";

const AttributeList = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    return (
        <CommonLayout h1={t("navigation.master_pro__attr_label")}>
            <PageHeader
                subtitle={t("navigation.master_pro__attr_label")}
                btnLabel={t("common.addNew")}
            >
                <Button
                    variant="info"
                    onClick={() => navigate(PATHS.MASTER_ATTRIBUTE_ADD + "/0")}
                    title={t("common.addNew")}
                >
                    {t("common.addNew")}
                </Button>
            </PageHeader>
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
                <AttributeTable />
            </div>
        </CommonLayout>
    );
};

export default AttributeList;
