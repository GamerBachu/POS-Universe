import React, { useState } from "react";
import { useLanguage } from "@/contexts/language";
import { useAuth } from "@/contexts/authorize";
import type { IUserFull } from "@/types/user";
import { userApi } from "@/api";
import { LoggerUtils, getName } from "@/utils";
import Modal from "@/components/Modal";
import { DatePickerWithLabel, SelectWithLabel, TextBoxWithLabel } from "@/components/input";
import { Button } from "@/components/button";

/**
 * UserProfileEditModal Component
 * Form modal for updating personal information, address, and profile details.
 */
interface UserProfileEditModalProps {
    isOpen: boolean;
    data: IUserFull;
    onClose: () => void;
    onSuccess: () => void;
}

const UserProfileEditModal = ({
    isOpen,
    data,
    onClose,
    onSuccess,
}: UserProfileEditModalProps) => {
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
        dateOfBirth: data.profile?.dateOfBirth
            ? data.profile.dateOfBirth.split("T")[0]
            : "",
        addressLine1: data.profile?.addressLine1 || "",
        addressLine2: data.profile?.addressLine2 || "",
        city: data.profile?.city || "",
        state: data.profile?.state || "",
        postalCode: data.profile?.postalCode || "",
        country: data.profile?.country || "",
        designation: data.workplace?.designation || "",
    });

    /**
     * Generic input change handler
     */
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    /**
     * Handle form submission and update context/API
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await userApi.updateFullProfile(data.id!, {
                user: {
                    id: auth.info.authUser?.userId,
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
                workplace: { designation: form.designation },
            });
            if (res.success) {
                // Update global auth context with new name information to ensure UI consistency
                if (auth.info?.authUser) {
                    auth.setInfo({
                        ...auth.info,
                        authUser: {
                            ...auth.info.authUser,
                            displayName: getName(
                                form.nameFirst,
                                form.nameMiddle,
                                form.nameLast,
                            ),
                        },
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
        <Modal
            className="w-full max-w-xl"
            title={t("profile.title")}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit} className="flex flex-col max-h-[85vh]">
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {/* Name Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <TextBoxWithLabel
                            label={t("common.name")}
                            placeholder={t("common.name")}
                            name="nameFirst"
                            value={form.nameFirst}
                            onChange={handleChange}
                            required={true}
                        />
                        <TextBoxWithLabel
                            label={t("profile.middle_name")}
                            placeholder={t("profile.middle_name")}
                            name="nameMiddle"
                            value={form.nameMiddle}
                            onChange={handleChange}
                        />
                        <TextBoxWithLabel
                            label={t("profile.last_name")}
                            placeholder={t("profile.last_name")}
                            name="nameLast"
                            value={form.nameLast}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Avatar & Designation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <TextBoxWithLabel
                            label={t("profile.avatar_url")}
                            name="avatarUrl"
                            value={form.avatarUrl}
                            onChange={handleChange}
                            placeholder="https://..."
                        />
                        <TextBoxWithLabel
                            label={t("profile.designation")}
                            placeholder={t("profile.designation")}
                            name="designation"
                            value={form.designation}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Bio Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <TextBoxWithLabel
                            label={t("profile.phone_number")}
                            placeholder={t("profile.phone_number")}
                            name="phoneNumber"
                            value={form.phoneNumber}
                            onChange={handleChange}
                        />
                        <div className="space-y-1">
                            <SelectWithLabel
                                label={t("profile.gender")}
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                            >
                                <option value="">{t("common.select")}</option>
                                <option value="male">{t("profile.gender_male")}</option>
                                <option value="female">{t("profile.gender_female")}</option>
                                <option value="other">{t("profile.gender_other")}</option>
                                <option value="prefer_not_to_say">
                                    {t("profile.gender_none")}
                                </option>
                            </SelectWithLabel>
                        </div>
                        <div className="space-y-1">
                            <DatePickerWithLabel
                                label={t("profile.dob")}
                                name="dateOfBirth"
                                value={form.dateOfBirth}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <TextBoxWithLabel
                                label={t("profile.address_line1")}
                                placeholder={t("profile.address_line1")}
                                name="addressLine1"
                                value={form.addressLine1}
                                onChange={handleChange}
                            />
                            <TextBoxWithLabel
                                label={t("profile.address_line2")}
                                placeholder={t("profile.address_line2")}
                                name="addressLine2"
                                value={form.addressLine2}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <TextBoxWithLabel
                                label={t("profile.city")}
                                placeholder={t("profile.city")}
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                            />
                            <TextBoxWithLabel
                                label={t("profile.state")}
                                placeholder={t("profile.state")}
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                            />
                            <TextBoxWithLabel
                                label={t("profile.zip")}
                                placeholder={t("profile.zip")}
                                name="postalCode"
                                value={form.postalCode}
                                onChange={handleChange}
                            />
                            <TextBoxWithLabel
                                label={t("profile.country")}
                                placeholder={t("profile.country")}
                                name="country"
                                value={form.country}
                                onChange={handleChange}
                                required={true}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        title={t("common.cancel")}>
                        {t("common.cancel")}
                    </Button>

                    <Button
                        variant="primary"
                        type="submit"
                        title={t("common.save")}
                        isLoading={isSaving}
                    >
                        {t("common.update")}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default UserProfileEditModal;
