import CommonLayout from "@/layouts/CommonLayout";
import { useLanguage } from "@/contexts/language";
import { useState } from "react";
import SearchIcon from "@/libs/icons/SearchIcon";
import { TextBox } from "@/components/input/TextBox";

const AboutPage = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
  ];

  const filteredFaqs = faqs.filter(
    (item) =>
      item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <CommonLayout h1={t("navigation.about_label")}>
      <div className="flex flex-col h-full bg-gray-50/30 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
        {/* 1. Header Section with Integrated Search */}
        <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">

                {t("faq.title")}
              </h2>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-tight">
                {t("faq.desc")}
              </p>
            </div>

            <div className="relative w-full md:w-72">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
              <TextBox
                placeholder={t("faq.search_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {/* 2. Questions List */}
        <div className="p-4 space-y-3 overflow-y-auto">
          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className="p-4 bg-white dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800 rounded-lg group hover:border-teal-500/50 transition-colors duration-200"
            >
              <div className="flex items-start gap-3">

                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">
                    {faq.q}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
              <p className="text-sm text-gray-400">{t("faq.no_results")}</p>
            </div>
          )}
        </div>
      </div>
    </CommonLayout>
  );
};

export default AboutPage;