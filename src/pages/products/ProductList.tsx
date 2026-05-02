import CommonLayout from "@/layouts/CommonLayout";
import { useLanguage } from "@/contexts/language";
import { PATHS } from "@/routes/paths";
import { useNavigate } from "react-router-dom";
import ProductTable from "./ProductTable";
import PageHeader from "@/components/PageHeader";

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return (
    <CommonLayout h1={t("navigation.product_list_label")}>

      <PageHeader
        subtitle={t("navigation.product_list_label")}
        btnClass="bg-green-600 hover:bg-green-700"
        btnLabel={t("common.addNew")}
        onClick={() => navigate(PATHS.PRODUCT_ADD + "/0")}
      />

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <ProductTable />
      </div>
    </CommonLayout>
  );
};
export default ProductList;