import { useAuth } from '@/contexts/authorize';
import ThemeToggleIcon from './ThemeToggleIcon';

const Header = ({ label = "Loading..." }: { label?: string; }) => {
    const auth = useAuth();
    const name = auth.info.isAuthorized
        ? (auth.info.authUser?.displayName || "")
        : "...";


    return (
        <header className="flex justify-between items-center p-2 flex-shrink-0">
            <h1 className="text-1xl font-bold">
                {label}
            </h1>
            <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">{name}</div>
                <ThemeToggleIcon className="p-1 rounded-sm border border-gray-300 dark:border-gray-600" />
            </div>
        </header>
    );
};

export default Header;