import { useCallback, useEffect, useMemo, useRef } from "react";
import resource from "@/locales/en.json";
import { useLocation, useNavigate } from "react-router";
import { userApi } from "@/api";
import { useAuth } from "@/contexts/authorize";
import { isValidPath, PATHS } from "@/routes/paths";
import { getName, CookieStorage, StorageKeys } from "@/utils";
import type { IAuthorize } from "@/contexts/authorize/type";
import type { IUser, IRefreshToken } from "@/types/user";
import Loader from "@/components/Loader";

const Verify = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isVerifying = useRef(false); // Prevent double-execution in Strict Mode

    // block paths that we should never redirect "back" to
    const AUTH_PATHS = useMemo(() => new Set([
        "/",
        PATHS.LOGIN,
        PATHS.REGISTER,
        PATHS.LOGOUT,
        PATHS.ERROR,
        // PATHS.VERIFY is likely the current route
    ]), []);


    const getSafeRedirectUrl = useCallback(() => {
        const from = location.state?.from;
        const fromUrl = from?.pathname;

        if (!fromUrl || AUTH_PATHS.has(fromUrl) || !isValidPath(fromUrl)) {
            return PATHS.START;
        }

        return fromUrl + (from?.search || "");
    }, [AUTH_PATHS, location.state?.from]);

    useEffect(() => {
        // Guard for React 18+ Strict Mode double-mount
        if (isVerifying.current) return;
        isVerifying.current = true;

        const storedToken = CookieStorage.get((StorageKeys.TOKEN));

        const handleVerification = async () => {
            if (!storedToken || storedToken.length === 0) {
                return performRedirect(false);
            }

            try {
                const response = await userApi.postValidateToken(storedToken);

                if (response?.status === 200 && response.data) {
                    const { user, token } = response.data as { user: IUser; token: IRefreshToken; };

                    const info: IAuthorize = {
                        authUser: {
                            userId: user.id,
                            displayName: getName(user.nameFirst, user.nameMiddle, user.nameLast),
                            username: user.username,
                            roles: [],
                            refreshToken: token.token,
                        },
                        isAuthorized: true,
                    };

                    auth.setInfo(info);
                    return performRedirect(true);
                }

                performRedirect(false);
            } catch {
                performRedirect(false);
            }
        };

        const performRedirect = (success: boolean) => {
            if (success) {
                navigate(getSafeRedirectUrl(), { replace: true });
            } else {
                auth.setInfo(undefined);
                navigate(PATHS.LOGIN, {
                    replace: true,
                    state: { from: location.state?.from || location }
                });
            }
        };

        handleVerification();
    }, [auth, navigate, getSafeRedirectUrl, location]);

    return (<Loader label={resource.common.verify_user}></Loader>);
};

export default Verify;