import { useCallback, useEffect, useState } from "react";
import {
  productApi,
  masterProductAttributeApi,
  productAttributeApi,
  productImageApi,
  productDescriptionApi,
  productKeywordApi,
} from "@/api";
import ProductDetailsSection from "./ProductDetailsSection";
import ProductFinancialSection from "./ProductFinancialSection";
import ProductAttributesSection from "./ProductAttributesSection";
import ProductImagesSection from "./ProductImagesSection";
import ProductFormFooter from "./ProductFormFooter";
import { ActionStatusMessage } from "@/components/ActionStatusMessage";
import type { IMasterProductAttribute } from "@/types/masters";
import { useNavigate, useParams } from "react-router-dom";
import CommonLayout from "@/layouts/CommonLayout";
import resource from "@/locales/en.json";
import { PATHS } from "@/routes/paths";

import type {
  IProduct,
  IProductAttributeView,
  IProductDescription,
  IProductImageView,
  IProductKeywordView,
} from "@/types/product";
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
import ProductKeywordsSection from "./ProductKeywordsSection";

const ProductForm = () => {
  const { id: rawId, action: rawAction } = useParams();
  const navigate = useNavigate();
  const id = Number(rawId);
  const action = rawAction?.toLowerCase() || "add";
  const isReadOnly = action === "view" || action === "delete";

  // Consolidated form state
  const [formState, setFormState] = useState<IActionState>({
    success: false,
    message: "",
    status: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Product data state
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

  // Related data state
  const [masterAttributes, setMasterAttributes] = useState<IMasterProductAttribute[]>([]);
  const [attributeRows, setAttributeRows] = useState<IProductAttributeView[]>([]);
  const [imageRows, setImageRows] = useState<IProductImageView[]>([]);
  const [descriptionItem, setDescriptionItem] = useState<IProductDescription>({
    productId: 0,
    description: "",
    id: 0,
  });
  const [keywordRows, setKeywordRows] = useState<IProductKeywordView[]>([]);
  const [formVersion, setFormVersion] = useState<number>(0);

  // Consolidated data loading effect
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load master attributes
        const masterRes = await masterProductAttributeApi.getAll();
        if (masterRes.success && masterRes.data) {
          setMasterAttributes(masterRes.data.filter((a) => a.isActive));
        }

        // Load product only if editing/viewing
        if (id && action !== "add") {
          const [productRes, attrRes, imgRes, descRes, keywordRes] = await Promise.all([
            productApi.getById(id),
            productAttributeApi.getAllByProductId(id),
            productImageApi.getAllByProductId(id),
            productDescriptionApi.getByProductId(id),
            productKeywordApi.getAllByProductId(id),
          ]);

          if (productRes.success && productRes.data) {
            setItem(productRes.data);
          }
          if (attrRes.success && attrRes.data) {
            setAttributeRows(transformAttributesToView(attrRes.data));
          }
          if (imgRes.success && imgRes.data) {
            setImageRows(imgRes.data);
          }
          if (descRes.success && descRes.data) {
            setDescriptionItem(descRes.data);
          }
          if (keywordRes.success && keywordRes.data) {
            setKeywordRows(
              keywordRes.data.map((k) => ({ ...k, rowid: generateGuid() + "-" + id })),
            );
          }
        }
      } catch (error) {
        LoggerUtils.logCatch(error, "ProductForm", "loadData");
      }
    };

    loadData();
  }, [id, action]);

  // Consolidated row handlers (Attributes, Images, Keywords)
  const handleAddAttributeRow = useCallback(() => {
    setAttributeRows((prev) => [
      ...prev,
      {
        attributeId: 0,
        value: "",
        productId: action === "add" ? 0 : id,
        rowid: generateGuid() + "-" + (action === "add" ? 0 : id),
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
    [attributeRows],
  );

  const handleAttributeRowChange = useCallback(
    (rowid: string, field: "attributeId" | "value", value: string | number) => {
      setAttributeRows((prev) =>
        prev.map((p) => (p.rowid === rowid ? { ...p, [field]: value } : p)),
      );
    },
    [],
  );

  const handleAddImageRow = useCallback(() => {
    setImageRows((prev) => [
      ...prev,
      {
        rowid: generateGuid() + "-" + (action === "add" ? 0 : id),
        productId: action === "add" ? 0 : id,
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
      setImageRows((prev) =>
        prev.filter((p) => p.rowid !== rowid && p.id?.toString() !== rowid),
      );
    },
    [imageRows],
  );

  const handleImageRowChange = useCallback(
    (rowid: string, field: "title" | "description" | "url", value: string) => {
      setImageRows((prev) =>
        prev.map((p) =>
          p.rowid === rowid || p.id?.toString() === rowid
            ? { ...p, [field]: value }
            : p,
        ),
      );
    },
    [],
  );

  const handleAddKeywordRow = useCallback(() => {
    setKeywordRows((prev) => [
      ...prev,
      {
        rowid: generateGuid() + "-" + (action === "add" ? 0 : id),
        productId: action === "add" ? 0 : id,
        keyword: "",
      },
    ]);
  }, [action, id]);

  const handleRemoveKeywordRow = useCallback(
    async (rowid: string) => {
      const row = keywordRows.find((p) => p.rowid === rowid);
      if (row?.id && row.id > 0) {
        await productKeywordApi.delete(row.id);
      }
      setKeywordRows((prev) => prev.filter((p) => p.rowid !== rowid));
    },
    [keywordRows],
  );

  const handleKeywordRowChange = useCallback(
    (rowid: string, value: string) => {
      setKeywordRows((prev) =>
        prev.map((p) => (p.rowid === rowid ? { ...p, keyword: value } : p)),
      );
    },
    [],
  );

  const onSendBack = useCallback(() => {
    if (window.history.length > 1 && window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate(PATHS.PRODUCT_LIST);
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFormState({ success: false, message: "", status: 0 });

    try {
      const formData = new FormData(e.currentTarget);
      const payload = Object.fromEntries(formData) as Record<string, string>;

      // Collect attribute rows
      const attributes = collectAttributesFromForm(attributeRows, formData);

      // Collect image rows
      const images = collectImagesFromForm(imageRows, formData);

      // Handle product deletion
      if (action === "delete") {
        await productDescriptionApi.deleteByProductId(id);
        await productKeywordApi.deleteByProductId(id);
        await productAttributeApi.deleteByProductId(id);
        await productImageApi.deleteByProductId(id);
        const res = await handleProductDeletion(id);
        if (res.success) {
          onSendBack();
          return;
        }
        setFormState({
          success: false,
          message: resource.common.fail_delete,
          status: 500,
        });
        return;
      }

      // Validate payload
      const validation = validateProductPayload(payload);
      if (!validation.valid) {
        setFormState({
          success: false,
          message: resource.product_inventory.required_fields,
          status: 400,
        });
        return;
      }

      // Format payload
      const formattedPayload = formatProductPayload(payload, action, id);

      // Description payload
      const description = payload.descContent || "";
      const descriptionPayload: IProductDescription = {
        ...descriptionItem,
        productId: id,
        description,
      };

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
        setFormState({
          success: false,
          message: apiResult.message,
          status: 500,
        });
        return;
      }

      // Save related data
      const refProductId: number =
        action === "add" ? Number(response.data) : id;
      const warningMessages: string[] = [];

      if (refProductId > 0) {
        // Save attributes
        const newAttributeRows = await handleAttributesSave(
          action,
          refProductId,
          attributes,
        );
        setAttributeRows(newAttributeRows);

        // Save images
        const newImageRows = await handleImagesSave(
          action,
          refProductId,
          images,
        );
        setImageRows(newImageRows);

        // Save descriptions
        if (descriptionPayload?.description?.trim()) {
          if (descriptionPayload.id && descriptionPayload.id > 0) {
            const descRes = await productDescriptionApi.update(
              descriptionPayload.id,
              descriptionPayload,
            );
            if (!descRes.success) {
              warningMessages.push(
                descRes.message || "Failed to update product description.",
              );
            } else {
              setDescriptionItem({ ...descriptionPayload });
            }
          } else {
            const newIdRes = await productDescriptionApi.add(descriptionPayload);
            if (!newIdRes.success) {
              warningMessages.push(
                newIdRes.message || "Failed to add product description.",
              );
            } else {
              setDescriptionItem({ ...descriptionPayload, id: newIdRes.data });
            }
          }
        }

        // Save keywords
        try {
          const savedKeywordRows = await Promise.all(
            keywordRows.map(async (row) => {
              const keywordPayload = { ...row, productId: refProductId };
              if (keywordPayload.rowid) delete keywordPayload.rowid;
              if (row.id && row.id > 0) {
                const res = await productKeywordApi.update(
                  row.id,
                  keywordPayload,
                );
                if (!res.success)
                  throw new Error(
                    res.message || `Failed to update keyword: ${row.keyword}`,
                  );
                return row;
              }
              const res = await productKeywordApi.add(keywordPayload);
              if (!res.success)
                throw new Error(
                  res.message || `Failed to add keyword: ${row.keyword}`,
                );
              return { ...row, id: res.data };
            }),
          );
          setKeywordRows(savedKeywordRows as IProductKeywordView[]);
        } catch (error) {
          warningMessages.push(
            (error as Error).message || "Failed to save keywords.",
          );
        }
      }

      // Update item state and increment form version to trigger remount
      setItem(formattedPayload);
      setFormVersion((prev) => prev + 1);

      if (warningMessages.length > 0) {
        setFormState({
          success: true,
          message: `${resource.common.success_save} Warnings: ${warningMessages.join(", ")}`,
          status: 200,
        });
      } else {
        setFormState({
          success: true,
          message: resource.common.success_save,
          status: 200,
        });
      }
    } catch (error) {
      LoggerUtils.logCatch(error, "ProductForm", "handleSubmit");
      setFormState({
        success: false,
        message: resource.common.error,
        status: 500,
      });
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* SECTION 3: State Toggle */}
        <RadioActiveToggle
          isActive={item.isActive}
          isReadOnly={isReadOnly}
          title={resource.common.active}
          desc={resource.common.toggle_active}
          name="isActive"
        />

        {/* SECTION 4: Product Description */}
        <ProductDescriptionSection
          descriptionItem={descriptionItem}
          isReadOnly={isReadOnly}
        />
        <hr className="dark:border-gray-700" />
        {/* SECTION 5: Dynamic Master Attributes */}
        <ProductAttributesSection
          attributeRows={attributeRows}
          masterAttributes={masterAttributes}
          isReadOnly={isReadOnly}
          onAddRow={handleAddAttributeRow}
          onRemoveRow={handleRemoveAttributeRow}
          onChangeRow={handleAttributeRowChange}
        />

        <hr className="dark:border-gray-700" />

        {/* SECTION 6: Product Images */}
        <ProductImagesSection
          imageRows={imageRows}
          isReadOnly={isReadOnly}
          onAddRow={handleAddImageRow}
          onRemoveRow={handleRemoveImageRow}
          onChangeRow={handleImageRowChange}
        />

        <hr className="dark:border-gray-700" />

        {/* SECTION 7: Product Keyword List */}
        <ProductKeywordsSection
          keywordRows={keywordRows}
          isReadOnly={isReadOnly}
          onAddRow={handleAddKeywordRow}
          onRemoveRow={handleRemoveKeywordRow}
          onChangeRow={handleKeywordRowChange}
        />
        {/* SECTION 8: Action Status Message */}
        <ActionStatusMessage
          message={state?.message}
          success={state?.success ?? false}
        />

        {/* SECTION 9:Action Footer */}
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
