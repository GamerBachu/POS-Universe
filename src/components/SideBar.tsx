

import { Link } from 'react-router-dom';

const SideBar = () => {






    return (
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0 transition-colors duration-200">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-4">POS Universe</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-1">
                    <li>
                        <Link to="/home">Home</Link>
                    </li>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                    <li>
                        <Link to="/account/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/account/register">Register</Link>
                    </li>
                    <li>
                        <Link to="/account/profile">Profile</Link>
                    </li>
                    <li>
                        <Link to="/account/logout">Logout</Link>
                    </li>
                    <li>
                        <Link to="/Error">Error</Link>
                    </li>

                    <li><Link to="/dashboard" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Overview</Link></li>
                    <li><Link to="/reports" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Reports</Link></li>
                    <li><Link to="/sales" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Sales</Link></li>
                    <li><Link to="/inventory" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Inventory</Link></li>
                    <li><Link to="/customers" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Customers</Link></li>
                    <li><Link to="/dashboard" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Overview</Link></li>
                    <li><Link to="/reports" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Reports</Link></li>
                    <li><Link to="/sales" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Sales</Link></li>
                    <li><Link to="/inventory" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Inventory</Link></li>
                    <li><Link to="/customers" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Customers</Link></li>
                    <li><Link to="/dashboard" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Overview</Link></li>
                    <li><Link to="/reports" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Reports</Link></li>
                    <li><Link to="/sales" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Sales</Link></li>
                    <li><Link to="/inventory" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Inventory</Link></li>
                    <li><Link to="/customers" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Customers</Link></li>
                    <li><Link to="/dashboard" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Overview</Link></li>
                    <li><Link to="/reports" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Reports</Link></li>
                    <li><Link to="/sales" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Sales</Link></li>
                    <li><Link to="/inventory" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Inventory</Link></li>
                    <li><Link to="/customers" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Customers</Link></li>
                    <li><Link to="/dashboard" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Overview</Link></li>
                    <li><Link to="/reports" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Reports</Link></li>
                    <li><Link to="/sales" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Sales</Link></li>
                    <li><Link to="/inventory" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Inventory</Link></li>
                    <li><Link to="/customers" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Customers</Link></li>
                    <li><Link to="/dashboard" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Overview</Link></li>
                    <li><Link to="/reports" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Reports</Link></li>
                    <li><Link to="/sales" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Sales</Link></li>
                    <li><Link to="/inventory" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Inventory</Link></li>
                    <li><Link to="/customers" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Customers</Link></li>
                    <li><Link to="/settings" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Settings</Link></li>
                </ul>
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">v1.0.0</div>
            </div>
        </aside>
    );
};

export default SideBar;