import { useLanguage } from "@/contexts/language";
import { HouseIcon } from "@/libs/icons";
import { PATHS } from "@/routes/paths";
import { useNavigate } from "react-router-dom";
import { OutlineButton } from "./button";

type ButtonHomeProps = {
    className?: string;
};

const ButtonHome = ({ className = "" }: ButtonHomeProps) => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <OutlineButton
            variant="secondary"
            onClick={() => navigate(PATHS.DASHBOARD)}
            className={`${className} border-sm w-fit !px-1 !py-1`}
            aria-label={t("navigation.dashboard_label")}
            title={t("navigation.dashboard_label")}
            icon={<HouseIcon className="w-4 h-4" />}
        >
        </OutlineButton>
    );
};

export default ButtonHome;