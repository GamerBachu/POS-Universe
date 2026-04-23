import React, { useState } from "react";
import { useLanguage } from "@/contexts/language";
import { useAuth } from "@/contexts/authorize";
import type { IUserFull } from "@/types/user";
import { userApi } from "@/api";
import { LoggerUtils, getName } from "@/utils";
import Button from "@/components/Button";
import Modal from "@/components/Modal";

interface UserProfileEditModalProps {
    isOpen: boolean;
    data: IUserFull;
    onClose: () => void;
    onSuccess: () => void;
}

const UserProfileEditModal = ({ isOpen, data, onClose, onSuccess }: UserProfileEditModalProps) => {
    const { t } = useLanguage();
    const auth = useAuth();
    const [isSaving, setIsSaving] = useState(false);

    // Form state initialized with existing user data
    const [form, setForm] = useState({
        nameFirst: data.nameFirst || "",
        nameMiddle: data.nameMiddle || "",
        nameLast: data.nameLast || "",
        avatarUrl: data.profile?.avatarUrl || "",
        phoneNumber: data.profile?.phoneNumber || "",
        gender: data.profile?.gender || "",
        dateOfBirth: data.profile?.dateOfBirth ? data.profile.dateOfBirth.split('T')[0] : "",
        addressLine1: data.profile?.addressLine1 || "",
        addressLine2: data.profile?.addressLine2 || "",
        city: data.profile?.city || "",
        state: data.profile?.state || "",
        postalCode: data.profile?.postalCode || "",
        country: data.profile?.country || "",
        designation: data.workplace?.designation || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await userApi.updateFullProfile(data.id!, {
                user: {
                    nameFirst: form.nameFirst,
                    nameMiddle: form.nameMiddle,
                    nameLast: form.nameLast,
                },
                profile: {
                    avatarUrl: form.avatarUrl,
                    phoneNumber: form.phoneNumber,
                    gender: form.gender,
                    dateOfBirth: form.dateOfBirth,
                    addressLine1: form.addressLine1,
                    addressLine2: form.addressLine2,
                    city: form.city,
                    state: form.state,
                    postalCode: form.postalCode,
                    country: form.country,
                },
                workplace: { designation: form.designation }
            });
            if (res.success) {
                // Update global auth context with new name information to ensure UI consistency
                if (auth.info?.authUser) {
                    auth.setInfo({
                        ...auth.info,
                        authUser: {
                            ...auth.info.authUser,
                            displayName: getName(form.nameFirst, form.nameMiddle, form.nameLast)
                        }
                    });
                }

                onSuccess();
                onClose();
            } else {
                LoggerUtils.logError(res, "UserProfileEditModal", "handleSubmit");
            }
        } catch (error) {
            LoggerUtils.logCatch(error, "UserProfileEditModal", "handleSubmit");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal className="w-full max-w-xl" title={t("profile.title")} onClose={onClose}>
            <form onSubmit={handleSubmit} className="p-4 space-y-5">
                {/* Name Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{t("common.name")} (First)</label>
                        <input
                            name="nameFirst"
                            value={form.nameFirst}
                            onChange={handleChange}
                            className="w-full h-10 px-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-teal-500"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{t("profile.middle_name")}</label>
                        <input
                            name="nameMiddle"
                            value={form.nameMiddle}
                            onChange={handleChange}
                            className="w-full h-10 px-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-teal-500"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{t("profile.last_name")}</label>
                        <input
                            name="nameLast"
                            value={form.nameLast}
                            onChange={handleChange}
                            className="w-full h-10 px-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-teal-500"
                        />
                    </div>
                </div>

                {/* Avatar & Designation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Avatar URL</label>
                        <input
                            name="avatarUrl"
                            value={form.avatarUrl}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="w-full h-10 px-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-teal-500"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Designation</label>
                        <input
                            name="designation"
                            value={form.designation}
                            onChange={handleChange}
                            className="w-full h-10 px-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-teal-500"
                        />
                    </div>
                </div>

                {/* Bio Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Phone Number</label>
                        <input
                            name="phoneNumber"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            className="w-full h-10 px-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-teal-500"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Gender</label>
                        <select
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            className="w-full h-10 px-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-teal-500"
                        >
                            <option value="">{t("common.select")}</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer_not_to_say">Prefer not to say</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Date of Birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={form.dateOfBirth}
                            onChange={handleChange}
                            className="w-full h-10 px-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-teal-500"
                        />
                    </div>
                </div>

                {/* Address Section */}
                <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Address Line 1</label>
                            <input
                                name="addressLine1"
                                value={form.addressLine1}
                                onChange={handleChange}
                                className="w-full h-10 px-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-teal-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Address Line 2</label>
                            <input
                                name="addressLine2"
                                value={form.addressLine2}
                                onChange={handleChange}
                                className="w-full h-10 px-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-teal-500"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">City</label>
                            <input
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                className="w-full h-10 px-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-teal-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">State</label>
                            <input
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                className="w-full h-10 px-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-teal-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Zip</label>
                            <input
                                name="postalCode"
                                value={form.postalCode}
                                onChange={handleChange}
                                className="w-full h-10 px-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-teal-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Country</label>
                            <input
                                name="country"
                                value={form.country}
                                onChange={handleChange}
                                className="w-full h-10 px-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-teal-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
                    <Button type="button" onClick={onClose} className="flex-1 bg-gray-600 hover:bg-gray-700" title={t("common.cancel")}>
                        {t("common.cancel")}
                    </Button>
                    <Button type="submit" className="flex-[2] bg-teal-600 hover:bg-teal-700" title={t("common.save")} isLoading={isSaving}>
                        {t("common.save")}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default UserProfileEditModal;