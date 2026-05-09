import { useState, useEffect, useCallback, useMemo } from "react";
import { userApi } from "@/api";
import type { IUserFull } from "@/types/user";

import { useAuth } from "@/contexts/authorize";
import { useLanguage } from "@/contexts/language";
import { LoggerUtils, getName } from "@/utils";
import Loader from "@/components/Loader";
import CommonLayout from "@/layouts/CommonLayout";
import { AlertError, AlertInfo } from "@/components/ActionStatusMessage";
import { Status } from "@/components/badge";
import {
    toDisplayString,
    toDisplayStringWithoutTime,
} from "@/utils/helper/dateUtils";
import UserProfileEditModal from "./UserProfileEditModal";

import UserPasswordChangeModal from "./UserPasswordChangeModal";
import { Button } from "@/components/button";
import { ReadOnlyWithLabel } from "@/components/input";


const UserProfilePage = () => {
    const { t } = useLanguage();
    const auth = useAuth();

    // UI State
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<IUserFull | null>(null);

    // Modal Control State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    /**
     * Fetch full user profile data from the API
     */
    const fetchData = useCallback(
        async (userId: number) => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await userApi.getFullUser(userId);
                if (res.success && res.data) {
                    setData(res.data);
                } else {
                    setData(null);
                    LoggerUtils.logError(
                        res,
                        "UserProfilePage",
                        "fetchData",
                        "API response error",
                    );
                    setError(t("common.no_result"));
                }
            } catch (err) {
                setData(null);
                LoggerUtils.logCatch(err, "UserProfilePage", "fetchData");
                setError(t("common.error"));
            } finally {
                setIsLoading(false);
            }
        },
        [t],
    );

    // Initial Load Logic
    useEffect(() => {
        const userId = auth.info.authUser?.userId || 0;
        if (userId === 0) {
            setIsLoading(false);
            setError(t("common.session_expired"));
            return;
        }
        fetchData(userId);
    }, [fetchData, auth.info.authUser?.userId, t]);

    /**
     * Memoized initials for avatar fallback
     */
    const profileInitials = useMemo(() => {
        if (!data) return "";
        if (data.nameFirst && data.nameLast) {
            return `${data.nameFirst.charAt(0)}${data.nameLast.charAt(0)}`.toUpperCase();
        }
        return data.username?.slice(0, 2).toUpperCase() || "??";
    }, [data]);

    return (
        <CommonLayout h1={t("navigation.profile_label")}>
            {/* Conditional Rendering: Loading, Error, Empty, or Content */}
            {isLoading ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow my-3">
                    <div className="space-y-5 p-5 flex items-center justify-center">
                        <Loader label={t("common.loading")} />
                    </div>
                </div>
            ) : error ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow my-3">
                    <div className="space-y-5 p-5 flex items-center justify-center">
                        <AlertError message={error} />
                    </div>
                </div>
            ) : data === null ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow my-3">
                    <div className="space-y-5 p-5 flex items-center justify-center">
                        <AlertInfo message={t("common.no_result")} />
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 my-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-5">
                            {/* Avatar Section */}
                            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-white dark:border-gray-600 shadow-inner overflow-hidden">
                                {data?.profile?.avatarUrl ? (
                                    <img
                                        src={data.profile.avatarUrl}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-2xl font-bold text-gray-500 uppercase">
                                        {profileInitials}
                                    </span>
                                )}
                            </div>
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <h1 className="text-xl font-bold tracking-tight">
                                        {getName(
                                            data?.nameFirst,
                                            data?.nameMiddle,
                                            data?.nameLast,
                                        ) || ""}
                                    </h1>
                                </div>
                                <p className="text-xs uppercase font-black text-gray-400 tracking-widest mt-1">
                                    {data?.workplace?.designation ?? "-"}
                                </p>
                                <div className="flex gap-2 mt-2">
                                    <Status isActive={data?.isActive}>
                                        {data?.isActive ? t("common.active") : t("common.inactive")}
                                    </Status>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 uppercase">
                                        {data?.role?.name ?? "-"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="ml-auto shrink-0">
                            <Button
                                variant="primary"
                                title={t("common.update")}
                                onClick={() => setIsEditModalOpen(true)}
                                isLoading={isLoading}
                            >
                                {t("common.update")}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-6 mt-2 grid grid-cols-1 lg:grid-cols-3 gap-2">
                        <div className="lg:col-span-2 space-y-6">
                            <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-5">
                                    {t("profile.account_details")}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
                                    <div className="space-y-1">
                                        <ReadOnlyWithLabel
                                            label={t("common.email")}
                                            value={data?.email}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <ReadOnlyWithLabel
                                            label={t("profile.phone_number")}
                                            value={data?.profile?.phoneNumber || "-"}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <ReadOnlyWithLabel
                                            label={t("common.username")}
                                            value={data?.username}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <ReadOnlyWithLabel
                                            label={t("profile.dob")}
                                            value={data?.profile?.dateOfBirth ? toDisplayStringWithoutTime(data.profile.dateOfBirth) : "-"}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <ReadOnlyWithLabel
                                            label={t("profile.gender")}
                                            value={data?.profile?.gender ? t(`profile.gender_${data.profile.gender.toLowerCase()}` as Parameters<typeof t>[0]) : "-"}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <ReadOnlyWithLabel
                                            label={t("profile.member_since")}
                                            value={toDisplayString(data.createdDate)}
                                        />
                                    </div>
                                    <div className="space-y-1 md:col-span-2 lg:col-span-3">
                                        <ReadOnlyWithLabel
                                            label={t("profile.address")}
                                            value={[
                                                data?.profile?.addressLine1,
                                                data?.profile?.addressLine2,
                                                data?.profile?.city,
                                                data?.profile?.state,
                                                data?.profile?.postalCode,
                                                data?.profile?.country,
                                            ].filter(Boolean).join(", ") || "-"}
                                        />
                                    </div>
                                </div>
                            </section>
                            <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-5">
                                    {t("profile.security_privacy")}
                                </h2>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-8">
                                    <div className="space-y-1">
                                        <ReadOnlyWithLabel
                                            label={t("profile.last_login")}
                                            value={data?.security?.lastLoginDate
                                                ? ` ${toDisplayString(data.security.lastLoginDate)} from ${data.security.lastLoginIp}`
                                                : t("profile.no_login_history")}
                                        />
                                    </div>
                                    <div className="space-y-1 w-[180px]">
                                        <Button
                                            variant="primary"
                                            title={t("profile.updatePassword")}
                                            onClick={() => setIsPasswordModalOpen(true)}
                                            isLoading={isLoading}
                                        >
                                            {t("profile.updatePassword")}
                                        </Button>
                                    </div>
                                </div>
                            </section>
                        </div>
                        <div className="space-y-6">
                            <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-5">
                                    {t("profile.workspace_settings")}
                                </h2>

                                <div className="space-y-5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold">{t("profile.theme")}</span>
                                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700">
                                            {data?.settings?.theme || "System"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold">{t("profile.start_page")}</span>
                                        <span className="text-[10px] font-mono font-bold text-blue-500">
                                            {data?.settings?.startPage || "/dashboard"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold">{t("profile.sidebar_collapsed")}</span>
                                        <div
                                            className={`w-8 h-4 rounded-full relative transition-colors ${data?.settings?.sidebarCollapsed ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700"}`}
                                        >
                                            <div
                                                className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-200 ${data?.settings?.sidebarCollapsed ? "right-0.5" : "left-0.5"}`}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                                            {t("profile.regional_preferences")}
                                        </h2>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase">
                                                    {t("profile.language")}
                                                </span>
                                                <span className="text-xs font-semibold">
                                                    {data?.profile?.languagePreference || "en-US"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase">
                                                    {t("profile.timezone")}
                                                </span>
                                                <span className="text-xs font-semibold">
                                                    {data?.profile?.timezone || "UTC"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
                                    {t("profile.permissions_access")}
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {data?.role?.permissions || data?.settings?.permissions ? (
                                        [
                                            ...new Set([
                                                ...(data?.role?.permissions?.split(",") || []),
                                                ...(data?.settings?.permissions?.split(",") || []),
                                            ]),
                                        ]
                                            .filter(Boolean)
                                            .map((perm) => (
                                                <span
                                                    key={perm}
                                                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-[9px] font-mono font-bold uppercase border border-gray-200 dark:border-gray-600"
                                                >
                                                    {perm.trim()}
                                                </span>
                                            ))
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">
                                            {t("common.no_record")}
                                        </span>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>

                    {data && isEditModalOpen === true && (
                        <UserProfileEditModal
                            isOpen={isEditModalOpen}
                            data={data}
                            onClose={() => setIsEditModalOpen(false)}
                            onSuccess={() => fetchData(auth.info.authUser?.userId || 0)}
                        />
                    )}

                    {data && isPasswordModalOpen === true && (
                        <UserPasswordChangeModal
                            isOpen={isPasswordModalOpen}
                            userId={data.id!}
                            onClose={() => setIsPasswordModalOpen(false)}
                        />
                    )}
                </>
            )}
        </CommonLayout>
    );
};

export default UserProfilePage;
