import { useAuth } from "@/contexts/authorize";
import { Navigate, Outlet } from "react-router-dom";
import { PATHS } from "./paths";

const PublicRoute = () => {
    const auth = useAuth();
    const isAuthorized = auth?.info?.isAuthorized;
    return isAuthorized ? <Navigate to={PATHS.START} replace /> : <Outlet />;
};
export default PublicRoute;