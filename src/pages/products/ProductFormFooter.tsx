import Button from "@/components/Button";
import { useLanguage } from "@/contexts/language";

interface ProductFormFooterProps {
  action: string;
  isPending: boolean;
  isReadOnly: boolean;
  onBack: () => void;
}


export const ProductFormFooter: React.FC<ProductFormFooterProps> = ({
  action,
  isPending,
  isReadOnly,
  onBack,
}: ProductFormFooterProps) => {
  const { t } = useLanguage();
  return (
    <div className="flex justify-end gap-2 border-t pt-4 dark:border-gray-700">
      <Button
        type="button"
        onClick={onBack}
        className="bg-gray-600 hover:bg-gray-700"
      >
        {t("common.back_page")}
      </Button>

      {!isReadOnly ? (
        <Button
          type="submit"
          disabled={isPending}
          isLoading={isPending}
          className="bg-green-600 hover:bg-green-700"
        >
          {action === "add" ? t("common.save") : t("common.update")}
        </Button>
      ) : (
        action === "delete" && (
          <Button type="submit" className="bg-red-600 hover:bg-red-700">
            {t("common.delete")}
          </Button>
        )
      )}
    </div>
  );
};
