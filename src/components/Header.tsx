import { useAuth } from '@/contexts/authorize';
import { useEffect, useState } from 'react';
import ThemeToggleIcon from './ThemeToggleIcon';

const Header = () => {
    const [name, setName] = useState("");
    const auth = useAuth();

    useEffect(() => {

        const isAuthorized = auth.info.isAuthorized;
        if (isAuthorized) {
            const n = auth.info.authUser?.displayName || "";
            setName(n);
        }
        else {
            setName("xyz");
        }

    }, [auth]);


    return (
        <header className="flex justify-between items-center p-3 flex-shrink-0">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">{name}</div>
                <ThemeToggleIcon className="p-2 rounded-sm border border-gray-300 dark:border-gray-600" />
            </div>
        </header>
    );
};

export default Header;