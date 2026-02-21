import CommonLayout from "@/layouts/CommonLayout";
import resource from "@/locales/en.json";
import { PATHS } from "@/routes/paths";
import { useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const ProductForm = () => {

  const { id: rawId, action: rawAction } = useParams();
  const navigate = useNavigate();

  const id = Number(rawId);
  const action = rawAction?.toLowerCase() || "";



  const onSendBack = useCallback(
    () => {
      if (window.history.length > 1 && window.history.state?.idx > 0) {
        navigate(-1);
      } else {
        navigate(PATHS.PRODUCT_LIST);
      }
    },
    [navigate],
  );

  return (
    <CommonLayout h1={resource.navigation.product_list_label}>


      <div className="flex justify-between items-center mb-4 px-1">
        <h1 className="text-lg font-bold text-gray-800 dark:text-white capitalize">
          {action} {resource.navigation.master_pro__attr_label}
        </h1>
        <button
          onClick={onSendBack}
          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-sm font-medium shadow-sm transition-all"
        >
          {resource.common.back_page}
        </button>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">

      </div>
    </CommonLayout>
  );
};
export default ProductForm;