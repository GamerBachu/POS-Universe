
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import resource from "@/locales/en.json";

function AboutPage() {

  return (
    <div className="fixed inset-0 flex overflow-hidden">
      <SideBar></SideBar>
      <main className="flex-1 flex flex-col overflow-hidden transition-colors duration-200">
        <Header label={resource.navigation.about_label}></Header>
        <hr className="border-gray-200 dark:border-gray-700" />
        <div className="flex-1 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-800">

        </div>
      </main>
    </div>
  );
}
export default AboutPage;
