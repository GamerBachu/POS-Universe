import { Link } from 'react-router-dom';
import resource from "@/locales/en.json";
import { PATHS } from '@/routes/paths';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/authorize';
import { userApi } from "@/api";

const Logout = () => {
    const auth = useAuth();
    useEffect(() => {
        userApi.postLogout(auth.info.authUser?.username, auth.info.authUser?.guid);
        auth.setInfo(undefined);
    }, [auth]);
    return (
        <div className="flex flex-col items-center justify-center min-h-[inherit] text-center p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">

            <h2 className="text-2xl font-semibold mb-4">
                {resource.logout.successMessage}
            </h2>
            <p className="mb-8">
                {resource.logout.subtitle}
            </p>
            <Link to={PATHS.LOGIN} className="text-blue-500 hover:underline">
                {resource.login.submit}
            </Link>
        </div>
    );
};

export default Logout;