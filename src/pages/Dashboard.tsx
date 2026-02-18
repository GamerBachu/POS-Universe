import CommonLayout from '@/layouts/CommonLayout';
import resource from "@/locales/en.json";

const Dashboard = () => {
    return (
        <CommonLayout h1={resource.navigation.dashboard_label}>
            {/* Report Placeholders */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {/* Summary Cards */}
                {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                        <h3 className="text-lg font-semibold mb-2">Summary Report {item}</h3>
                        <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-gray-400 dark:text-gray-500">
                            Chart Placeholder
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Detailed Reports */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-96 transition-colors">
                    <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
                    <div className="h-full bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-gray-400 dark:text-gray-500">
                        Large Chart Placeholder
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-96 transition-colors">
                    <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                    <div className="h-full bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-gray-400 dark:text-gray-500">
                        List Placeholder
                    </div>
                </div>
            </div>

            {/* More content to ensure scrolling */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-64 transition-colors">
                <h3 className="text-lg font-semibold mb-4">Inventory Status</h3>
                <div className="h-full bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-gray-400 dark:text-gray-500">
                    Table Placeholder
                </div>
            </div>
        </CommonLayout>

    );
};

export default Dashboard;