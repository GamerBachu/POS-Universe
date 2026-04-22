import { useState, useEffect, useCallback, useMemo } from "react";
import { userApi } from "@/api";
import type { IUserFull } from "@/types/user";

import { useAuth } from "@/contexts/authorize";
import { useLanguage } from "@/contexts/language";
import { LoggerUtils, getName } from "@/utils";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import CommonLayout from "@/layouts/CommonLayout";
import { AlertError, AlertInfo } from "@/components/ActionStatusMessage";
import { Status } from "@/components/badge";
import { toDisplayString, toDisplayStringWithoutTime } from "@/utils/helper/dateUtils";

const UserProfilePage = () => {
    const { t } = useLanguage();
    const auth = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [data, setData] = useState<IUserFull | null>(null);

    const fetchData = useCallback(
        async (userId: number) => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await userApi.getFullUser(userId);
                if (res.success && res.data) {
                    setData(res.data);
                    console.log(res);
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

    useEffect(() => {
        const userId = auth.info.authUser?.userId ? auth.info.authUser?.userId : 0;
        if (!userId || userId === 0) {
            setIsLoading(false);
            setError(t("common.session_expired"));
            return;
        }
        fetchData(userId);
    }, [fetchData, auth.info.authUser?.userId, t]);


    const profileInitials = useMemo(() => {
        if (!data) return "";
        if (data.nameFirst && data.nameLast) {
            return `${data.nameFirst.charAt(0)}${data.nameLast.charAt(0)}`.toUpperCase();
        }
        return data.username?.slice(0, 2).toUpperCase() || "??";
    }, [data]);

    return (
        <CommonLayout h1={t("navigation.profile_label")}>
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
                            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-white dark:border-gray-600 shadow-inner overflow-hidden">
                                {data?.profile?.avatarUrl ? (
                                    <img src={data.profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
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
                                    <span className="text-[10px] font-mono text-gray-400">
                                        #{data?.id}
                                    </span>
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
                                    <span className="text-[10px] text-gray-500 italic">
                                        {data?.role?.description}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Button title="Edit Profile">Edit Profile</Button>
                    </div>

                    <div className="space-y-6 mt-6  grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                                        Account Details
                                    </h2>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-gray-400">
                                            {t("common.email")}
                                        </label>
                                        <p className="text-sm font-semibold">
                                            {data?.email}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-gray-400">
                                            Phone Number
                                        </label>
                                        <p className="text-sm font-semibold">
                                            {data?.profile?.phoneNumber || "-"}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-gray-400">
                                            {t("common.username")}
                                        </label>
                                        <p className="text-sm font-semibold">
                                            {data?.username}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-gray-400">
                                            Date of Birth
                                        </label>
                                        <p className="text-sm font-semibold">
                                            {data?.profile?.dateOfBirth ? toDisplayStringWithoutTime(data.profile.dateOfBirth) : "-"}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-gray-400">
                                            Gender
                                        </label>
                                        <p className="text-sm font-semibold capitalize">
                                            {data?.profile?.gender || "-"}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-gray-400">
                                            Member Since
                                        </label>
                                        <p className="text-sm font-semibold">
                                            {toDisplayString(data.createdDate)}
                                        </p>
                                    </div>
                                    <div className="space-y-1 md:col-span-2 lg:col-span-3">
                                        <label className="text-[10px] font-black uppercase text-gray-400">
                                            Address
                                        </label>
                                        <p className="text-sm font-semibold">
                                            {[
                                                data?.profile?.addressLine1,
                                                data?.profile?.addressLine2,
                                                data?.profile?.city,
                                                data?.profile?.state,
                                                data?.profile?.postalCode,
                                                data?.profile?.country
                                            ].filter(Boolean).join(", ") || "-"}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        >
                                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold">Security & Privacy</h3>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 flex items-center gap-2">
                                            <span>
                                                {data?.security?.lastLoginDate
                                                    ? `Last Login: ${toDisplayString(data.security.lastLoginDate)} from ${data.security.lastLoginIp}`
                                                    : "No login history available"}
                                            </span>
                                            {data?.security?.twoFactorEnabled && (
                                                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                                    <span className="w-1 h-1 rounded-full bg-current"></span>
                                                    2FA Enabled
                                                </span>
                                            )}
                                        </p>
                                        <div className="mt-2 flex gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] text-gray-400 uppercase font-bold">Failed Attempts</span>
                                                <span className="text-xs font-bold">{data?.security?.failedLoginAttempts || 0}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] text-gray-400 uppercase font-bold">Account Status</span>
                                                <span className={`text-xs font-bold ${data?.security?.isLockedOut ? 'text-red-500' : 'text-emerald-500'}`}>
                                                    {data?.security?.isLockedOut ? `Locked until ${data.security.lockoutUntil ? toDisplayString(data.security.lockoutUntil) : 'unlocked'}` : 'Clear'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button className="text-[10px] font-black text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-widest">
                                    Update
                                </button>
                            </section>
                        </div>
                        <div className="space-y-6">
                            <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-5">
                                    Workspace Settings
                                </h2>

                                <div className="space-y-5">

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold">Theme</span>
                                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700">
                                            {data?.settings?.theme || "System"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold">Start Page</span>
                                        <span className="text-[10px] font-mono font-bold text-blue-500">{data?.settings?.startPage || "/dashboard"}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold">Sidebar Collapsed</span>
                                        <div className={`w-8 h-4 rounded-full relative transition-colors ${data?.settings?.sidebarCollapsed ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${data?.settings?.sidebarCollapsed ? 'right-0.5' : 'left-0.5'}`}></div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                                            Regional Preferences
                                        </h2>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase">Language</span>
                                                <span className="text-xs font-semibold">{data?.profile?.languagePreference || "en-US"}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase">Timezone</span>
                                                <span className="text-xs font-semibold">{data?.profile?.timezone || "UTC"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm lg:col-span-2">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
                                Permissions & Access
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {(data?.role?.permissions || data?.settings?.permissions) ? (
                                    [...new Set([...(data?.role?.permissions?.split(',') || []), ...(data?.settings?.permissions?.split(',') || [])])]
                                        .filter(Boolean)
                                        .map((perm) => (
                                            <span key={perm} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-[9px] font-mono font-bold uppercase border border-gray-200 dark:border-gray-600">
                                                {perm.trim()}
                                            </span>
                                        ))
                                ) : (
                                    <span className="text-xs text-gray-400 italic">No specific permissions assigned.</span>
                                )}
                            </div>
                        </section>


                    </div>
                </>
            )}
        </CommonLayout>
    );
};

export default UserProfilePage;
