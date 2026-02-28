import { useCallback, useActionState, useEffect, useState } from "react";
import { masterProductAttributeApi } from "@/api/masterProductAttributeApi";
import { productAttributeApi } from "@/api/productAttributeApi";
import { productImageApi } from "@/api/productImageApi";
import { ProductDetailsSection } from "./ProductDetailsSection";
import { ProductFinancialSection } from "./ProductFinancialSection";

import { ProductAttributesSection } from "./ProductAttributesSection";
import { ProductImagesSection } from "./ProductImagesSection";
import { ProductFormFooter } from "./ProductFormFooter";
import { ActionStatusMessage } from "@/components/ActionStatusMessage";
import type { IMasterProductAttribute } from "@/types/masters";
import { useNavigate, useParams } from "react-router-dom";
import CommonLayout from "@/layouts/CommonLayout";
import resource from "@/locales/en.json";
import { PATHS } from "@/routes/paths";
import { productApi } from "@/api/productApi";
import { type IProduct, type IProductAttributeView, type IProductImageView } from "@/types/product";
import { LoggerUtils } from "@/utils";
import type { IActionState } from "@/types/actionState";
import { generateGuid } from "@/utils/helper/guid";
import {
  collectAttributesFromForm,
  collectImagesFromForm,
  formatProductPayload,
  validateProductPayload,
  handleAttributesSave,
  handleImagesSave,
  handleProductDeletion,
  handleApiResponse,
  transformAttributesToView,
} from "./productFormUtils";
import PageHeader from "@/components/PageHeader";
import RadioActiveToggle from "@/components/RadioActiveToggle";

const initialState = { success: false, message: "", status: 0 };

const ProductForm = () => {
  const { id: rawId, action: rawAction } = useParams();
  const navigate = useNavigate();
  const id = Number(rawId);
  const action = rawAction?.toLowerCase() || "add";

  // Master Attribute State
  const [masterAttributes, setMasterAttributes] = useState<IMasterProductAttribute[]>([]);

  const [attributeRows, setAttributeRows] = useState<IProductAttributeView[]>([]);

  const [imageRows, setImageRows] = useState<IProductImageView[]>([]);

  // Form versioning - increments after successful save to force remount
  const [formVersion, setFormVersion] = useState<number>(0);

  // Load product attributes for edit/view
  useEffect(() => {
    if (id && action !== "add") {
      productAttributeApi.getAllByProductId(id).then((res) => {
        if (res.success && res.data) {
          setAttributeRows(transformAttributesToView(res.data));
        }
      });
    }
  }, [id, action]);

  // Load product images for edit/view
  useEffect(() => {
    if (id && action !== "add") {
      productImageApi.getAllByProductId(id).then((res) => {
        if (res.success && res.data) {
          setImageRows(res.data);
        }
      });
    }
  }, [id, action]);

  // Fetch master attributes on mount
  useEffect(() => {
    masterProductAttributeApi.getAll().then((res) => {
      if (res.success && res.data)
        setMasterAttributes(res.data.filter((a) => a.isActive));
    });
  }, []);

  // Handlers for dynamic attribute rows (memoized with useCallback)
  const handleAddAttributeRow = useCallback(() => {
    const refProductId: number = action === "add" ? 0 : id;
    setAttributeRows((prev) => [
      ...prev,
      {
        attributeId: 0,
        value: "",
        productId: refProductId,
        rowid: generateGuid() + "-" + refProductId,
      },
    ]);
  }, [action, id]);

  const handleRemoveAttributeRow = useCallback(
    async (rowid: string) => {
      const row = attributeRows.find((p) => p.rowid === rowid);
      if (row?.id && row.id > 0) {
        await productAttributeApi.delete(row.id);
      }
      setAttributeRows((prev) => prev.filter((p) => p.rowid !== rowid));
    },
    [attributeRows]
  );

  const handleAttributeRowChange = useCallback(
    (rowid: string, field: "attributeId" | "value", value: string | number) => {
      setAttributeRows((prev) =>
        prev.map((p) => (p.rowid === rowid ? { ...p, [field]: value } : p))
      );
    },
    []
  );

  // Handlers for dynamic image rows (memoized with useCallback)
  const handleAddImageRow = useCallback(() => {
    const refProductId: number = action === "add" ? 0 : id;
    setImageRows((prev) => [
      ...prev,
      {
        rowid: generateGuid() + "-" + refProductId,
        productId: refProductId,
        title: "",
        description: "",
        url: "",
      },
    ]);
  }, [action, id]);

  const handleRemoveImageRow = useCallback(
    async (rowid: string) => {
      const row = imageRows.find((p) => p.rowid === rowid || p.id?.toString() === rowid);
      if (row?.id && row.id > 0) {
        await productImageApi.delete(row.id);
      }
      setImageRows((prev) => prev.filter((p) => p.rowid !== rowid && p.id?.toString() !== rowid));
    },
    [imageRows]
  );

  const handleImageRowChange = useCallback(
    (rowid: string, field: "title" | "description" | "url", value: string) => {
      setImageRows((prev) =>
        prev.map((p) =>
          (p.rowid === rowid || p.id?.toString() === rowid)
            ? { ...p, [field]: value }
            : p
        )
      );
    },
    []
  );

  const [item, setItem] = useState<IProduct>({
    id: 0,
    code: "",
    sku: "",
    barcode: "",
    name: "",

    costPrice: 0,
    sellingPrice: 0,
    taxRate: 0,

    stock: 0,
    reorderLevel: 5,

    isActive: true,
  });

  const onSendBack = useCallback(() => {
    if (window.history.length > 1 && window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate(PATHS.PRODUCT_LIST);
    }
  }, [navigate]);

  useEffect(() => {
    if (id && action !== "add") {
      productApi.getById(id).then((res) => {
        if (res.success && res.data) setItem(res.data);
      });
    }
  }, [id, action]);

  const handleAction = async (_: IActionState | null, formData: FormData) => {
    try {
      const payload = Object.fromEntries(formData) as Record<string, string>;

      // Collect attribute rows
      const attributes = collectAttributesFromForm(attributeRows, formData);

      // Collect image rows
      const images = collectImagesFromForm(imageRows, formData);

      // Handle product deletion
      if (action === "delete") {
        const res = await handleProductDeletion(id);
        if (res.success) {
          onSendBack();
          return { success: true, message: resource.common.success_delete };
        }
        return { success: false, message: resource.common.fail_delete };
      }

      // Validate payload
      const validation = validateProductPayload(payload);
      if (!validation.valid) {
        return { success: false, message: resource.product_inventory.required_fields };
      }

      // Format payload
      const formattedPayload = formatProductPayload(payload, action, id);

      // Save product
      const response =
        action === "edit"
          ? await productApi.update(id, formattedPayload)
          : await productApi.add(formattedPayload);

      // Handle API response errors
      const errorMap = {
        400: resource.product_inventory.required_fields,
        409: resource.product_inventory.already_exists,
        404: resource.product_inventory.product_not_found,
      };

      const apiResult = handleApiResponse(response, errorMap);
      if (!apiResult.success) {
        return { success: false, message: apiResult.message };
      }

      // Save attributes
      const refProductId: number = action === "add" ? Number(response.data) : id;
      if (refProductId > 0) {
        const newAttributeRows = await handleAttributesSave(action, refProductId, attributes);
        setAttributeRows(newAttributeRows);

        // Save images
        const newImageRows = await handleImagesSave(action, refProductId, images);
        setImageRows(newImageRows);
      }

      // Update item state and increment form version to trigger remount
      setItem(formattedPayload);
      setFormVersion(prev => prev + 1);
      return { success: true, message: resource.common.success_save };
    } catch (error) {
      LoggerUtils.logCatch(error, "ProductForm", "handleAction");
      return { success: false, message: resource.common.error, status: 500 };
    }
  };

  const [state, formAction, isPending] = useActionState(
    handleAction,
    initialState,
  );
  const isReadOnly = action === "view" || action === "delete";

  return (
    <CommonLayout h1={resource.navigation.product_list_label}>
      <PageHeader
        subtitle={`${action} ${resource.product_inventory.name}`}
        btnClass="bg-gray-600  hover:bg-gray-700"
        btnLabel={resource.common.back_page}
        onClick={() => navigate(PATHS.PRODUCT_LIST)}
      />

      <form
        key={`${item.id}-${action}-${formVersion}`}
        data-testid={`${item.id}-${action}-${formVersion}`}
        action={formAction}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6"
      >
        {/* SECTION 1: General Identifiers */}
        <ProductDetailsSection item={item} isReadOnly={isReadOnly} />

        <hr className="dark:border-gray-700" />

        {/* SECTION 2: Financial & Inventory */}
        <ProductFinancialSection item={item} isReadOnly={isReadOnly} />

        {/* State Toggle */}
        <RadioActiveToggle
          isActive={item.isActive}
          isReadOnly={isReadOnly}
          title={resource.common.active}
          desc={resource.common.toggle_active}
          name="isActive" />

        {/* SECTION 3: Dynamic Master Attributes */}
        <ProductAttributesSection
          attributeRows={attributeRows}
          masterAttributes={masterAttributes}
          isReadOnly={isReadOnly}
          onAddRow={handleAddAttributeRow}
          onRemoveRow={handleRemoveAttributeRow}
          onChangeRow={handleAttributeRowChange}
        />

        <hr className="dark:border-gray-700" />

        {/* SECTION 4: Product Images */}
        <ProductImagesSection
          imageRows={imageRows}
          isReadOnly={isReadOnly}
          onAddRow={handleAddImageRow}
          onRemoveRow={handleRemoveImageRow}
          onChangeRow={handleImageRowChange}
        />

        <ActionStatusMessage
          message={state?.message}
          success={state?.success ?? false}
        />

        {/* Action Footer */}
        <ProductFormFooter
          action={action}
          isPending={isPending}
          isReadOnly={isReadOnly}
          onBack={onSendBack}
        />
      </form>
    </CommonLayout>
  );
};

export default ProductForm;
