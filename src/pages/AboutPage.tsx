
import Header from "@/components/Header";
import LanguageSelector from "@/components/LanguageSelector";
import SideBar from "@/components/SideBar";
import { useTranslation } from "@/contexts/language";

function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 flex overflow-hidden">
      <SideBar></SideBar>
      <main className="flex-1 flex flex-col overflow-hidden transition-colors duration-200">
        <Header label={t("navigation.about_label")}></Header>
        <hr className="border-gray-200 dark:border-gray-700" />
        <div className="flex-1 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-800">
          <LanguageSelector></LanguageSelector>
        </div>
      </main>
    </div>
  );
}
export default AboutPage;
