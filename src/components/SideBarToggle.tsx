import { ChevronLeftIcon, DoubleArrowRightIcon } from "@/libs/icons";
import { OutlineButton } from "./button";
import { useLanguage } from "@/contexts/language";


type SideBarToggleProps = {
    className?: string;
    onClick: () => void;
    isMinimized: boolean;
};

const SideBarToggle: React.FC<SideBarToggleProps> = ({
    className = "",
    onClick,
    isMinimized,
}) => {
    const { t } = useLanguage();
    const lbl = isMinimized === true ? t("sidebar.show") : t("sidebar.hide");
    return (
        <OutlineButton
            variant="secondary"
            onClick={onClick}
            className={`${className} border-sm w-fit !px-1 !py-1`}
            aria-label={lbl}
            title={lbl}
            icon={isMinimized === true ? (<DoubleArrowRightIcon className="w-4 h-4" />) : (<ChevronLeftIcon className="w-4 h-4" />)}
        >
        </OutlineButton>


    );
};
export default SideBarToggle;
