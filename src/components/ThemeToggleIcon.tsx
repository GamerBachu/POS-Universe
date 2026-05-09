
import { useLanguage } from "@/contexts/language";
import { useTheme } from "../contexts/theme";
import { OutlineButton } from "./button";
import { MoonIcon, SunIcon } from "@/libs/icons";

type ThemeToggleIconProps = {
  className?: string;
};

const ThemeToggleIcon: React.FC<ThemeToggleIconProps> = ({ className = "" }) => {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  const lbl = theme === 'dark' ? t("common.light") : t("common.dark");

  return (
    <OutlineButton
      onClick={toggleTheme}
      variant="secondary"
      className={`${className} border-sm w-fit !px-1 !py-1`}
      aria-label={lbl}
      title={lbl}

    >
      <div
        className={`transition-all duration-500 ${theme === 'dark' ? 'rotate-0' : 'rotate-[360deg]'} group-hover:text-blue-600 dark:group-hover:text-blue-400 `}>
        {theme === "dark" ? (<SunIcon className="w-4 h-4" />) : (<MoonIcon className="w-4 h-4" />)}
      </div>
    </OutlineButton>
  );
};

export default ThemeToggleIcon;
