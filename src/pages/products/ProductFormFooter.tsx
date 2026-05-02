
import {
  DangerButton,
  PrimaryButton,
  SecondaryButton,
} from "@/components/button";
import { useLanguage } from "@/contexts/language";

interface ProductFormFooterProps {
  action: string;
  isPending: boolean;
  onBack: () => void;
}

export const ProductFormFooter: React.FC<ProductFormFooterProps> = ({
  action,
  isPending,
  onBack,
}: ProductFormFooterProps) => {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-end gap-2 pt-4 border-t dark:border-gray-700">
      <SecondaryButton
        onClick={onBack}
        title={t("common.back_page")}
        disabled={isPending}
        isLoading={isPending}
      >
        {t("common.back_page")}
      </SecondaryButton>
      {action === "delete" && (
        <DangerButton
          title={t("common.delete")}
          disabled={isPending}
          isLoading={isPending}
          type="submit"
        >
          {t("common.delete")}
        </DangerButton>
      )}

      {(action === "edit" || action === "add") && (
        <PrimaryButton
          title={t("common.save")}
          disabled={isPending}
          isLoading={isPending}
          type="submit"
        >
          {t("common.save")}
        </PrimaryButton>
      )}
    </div>
  );
};
