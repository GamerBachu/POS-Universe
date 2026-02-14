import { useAuth } from "@/contexts/authorize";
import { Navigate, Outlet } from "react-router-dom";
import { PATHS } from "./paths";

const ProtectedRoute = () => {
    const auth = useAuth();
    const isAuthorized = auth?.info?.isAuthorized;
    return isAuthorized === true ? <Outlet /> : <Navigate to={PATHS.LOGIN} replace />;
};
export default ProtectedRoute;