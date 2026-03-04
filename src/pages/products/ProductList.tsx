import CommonLayout from "@/layouts/CommonLayout";
import resource from "@/locales/en.json";
import { PATHS } from "@/routes/paths";
import { useNavigate } from "react-router-dom";
import ProductTable from "./ProductTable";
import PageHeader from "@/components/PageHeader";

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  return (
    <CommonLayout h1={resource.navigation.product_list_label}>

      <PageHeader
        subtitle={undefined}
        btnClass="bg-green-600 hover:bg-green-700"
        btnLabel={resource.common.add}
        onClick={() => navigate(PATHS.PRODUCT_ADD + "/0")}
      />

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <ProductTable />
      </div>
    </CommonLayout>
  );
};
export default ProductList;