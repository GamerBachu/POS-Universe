import Button from "@/components/Button";
import resource from "@/locales/en.json";

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
  return (
    <div className="flex justify-end gap-2 border-t pt-4 dark:border-gray-700">
      <Button
        type="button"
        onClick={onBack}
        className="bg-gray-600 hover:bg-gray-700"
      >
        {resource.common.back_page}
      </Button>

      {!isReadOnly ? (
        <Button
          type="submit"
          disabled={isPending}
          isLoading={isPending}
          className="bg-green-600 hover:bg-green-700"
        >
          {action === "add" ? resource.common.save : resource.common.update}
        </Button>
      ) : (
        action === "delete" && (
          <Button type="submit" className="bg-red-600 hover:bg-red-700">
            {resource.common.delete}
          </Button>
        )
      )}
    </div>
  );
};
