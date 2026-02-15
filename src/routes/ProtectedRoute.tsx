import { useAuth } from "@/contexts/authorize";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PATHS } from "./paths";

const ProtectedRoute = () => {
    const auth = useAuth();
    const location = useLocation();
    const isAuthorized = auth?.info?.isAuthorized; 
    return isAuthorized === true ? (
        <Outlet />
    ) : (
        <Navigate
            to={PATHS.VERIFY}
            state={{ from: location }}
            replace
        />
    );
};
export default ProtectedRoute;
