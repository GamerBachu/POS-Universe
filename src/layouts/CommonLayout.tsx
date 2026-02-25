import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import React from "react";
interface CommonLayoutProps {
    children: React.ReactNode;
    h1: string;
}
export const CommonLayout: React.FC<CommonLayoutProps> = ({ children, h1 }) => {
    return (
        <div className="fixed inset-0 flex overflow-hidden">
            <SideBar></SideBar>
            <main className="flex-1 flex flex-col overflow-hidden transition-colors duration-200">
                <Header label={h1}></Header>
                <hr className="border-gray-200 dark:border-gray-700" />
                <div className="flex-1 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-800">
                    {children}
                </div>
            </main>
        </div>
    );
};
export default CommonLayout;
