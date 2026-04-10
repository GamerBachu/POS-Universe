
import DatePicker from "@/components/DatePicker";
import Header from "@/components/Header";
import LanguageSelector from "@/components/LanguageSelector";
import SideBar from "@/components/SideBar";
import { useLanguage } from "@/contexts/language";
import { useState } from "react";

function AboutPage() {
  const { t } = useLanguage();

  const [selectedDate, setSelectedDate] = useState("");

  return (
    <div className="fixed inset-0 flex overflow-hidden">
      <SideBar></SideBar>
      <main className="flex-1 flex flex-col overflow-hidden transition-colors duration-200">
        <Header label={t("navigation.about_label")}></Header>
        <hr className="border-gray-200 dark:border-gray-700" />
        <div className="flex-1 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-800">
          <form className="shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" >
                Language selector
              </label>
              <LanguageSelector></LanguageSelector>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date-select">
                Date
              </label>
              <DatePicker
                label={t("common.date")}
                name="date-select"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                onClear={() => setSelectedDate("")}
                min="2024-01-01" // Standard prop passed through ...props
                classBox="flex-1"
              />
            </div>

          </form>


        </div>
      </main>
    </div>
  );
}
export default AboutPage;
