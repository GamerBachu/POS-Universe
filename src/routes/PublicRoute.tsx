
import {  Outlet } from "react-router-dom";


const PublicRoute = () => {
    // const auth = useAuth();
    // const isAuthorized = auth?.info?.isAuthorized;
    // return isAuthorized ? <Navigate to={PATHS.START} replace /> : <Outlet />;
    return <Outlet />;
};
export default PublicRoute;