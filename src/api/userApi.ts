import type { ServiceResponse } from "@/types/serviceResponse";
import db from "../libs/db/appDb";
import type {
    IUser,
    IRefreshToken,
    IAuthResponse,
    IUserFull,
    IUserProfile,
    IUserSettings,
    IUserWorkplace,
    IUserSecurity,
} from "@/types/user";
import { toUTCNowForDB } from "@/utils/helper/dateUtils";
import { generateGuidV2 } from "@/utils/helper/guid";
import { getDeviceInfo, tokenValidTill } from "@/utils";

export class userApi {
    static useStaticData = false; // Toggle for static data usage in development/testing

    private static getErrorMessage(error: unknown): string {
        return error instanceof Error ? error.message : "Operation failed";
    }

    // Standard CRUD
    static async getById(id: number) {
        return db.users.get(id);
    }
    static async add(payload: IUser) {
        return db.users.add(payload);
    }
    static async update(payload: Partial<IUser>, id: number) {
        return db.users.update(id, payload);
    }
    static async delete(id: number) {
        return db.users.delete(id);
    }

    /**
     * Terminate user session
     */
    static async postLogout(
        userId: number | undefined,
        refreshToken: string | undefined,
    ): Promise<ServiceResponse<string>> {
        if (!userId || !refreshToken) {
            return this.createResponse("", "User ID and token required.", false, 400);
        }

        await db.refreshTokens.where("userId").equals(userId).delete();
        return this.createResponse("", "Logged out successfully.");
    }

    /**
     * Authenticates user and initiates session
     */
    static async postLogin(
        username: string,
        password: string,
    ): Promise<ServiceResponse<IAuthResponse | null>> {
        if (!username || !password) {
            return this.createResponse(null, "Credentials required.", false, 400);
        }

        const user = await db.users
            .where("username")
            .equalsIgnoreCase(username)
            .first();
        const hashedInput = await this.encryptPassword(password);

        if (!user || user.password !== hashedInput) {
            return this.createResponse(
                null,
                "Invalid username or password.",
                false,
                401,
            );
        }

        // Security: Remove password from response
        const userRes = { ...user, password: "" };

        // Rotate Session: Clear old tokens and generate new one
        await db.refreshTokens.where("userId").equals(user.id).delete();
        const tokenData = await this.createSessionToken(user.id);

        // get last loginHistory
        const lastLoginHistory = await db.loginHistory
            .where("userId")
            .equals(user.id)
            .last();

        await db.loginHistory.add({
            userId: user.id,
            loginDate: toUTCNowForDB(),
            ipAddress: "", // IP capture can be implemented with additional libraries
            deviceInfo: getDeviceInfo(),
        });

        // Update last login date and IP
        await db.userSecurity
            .where("userId")
            .equals(user.id)
            .modify({
                lastLoginDate: lastLoginHistory?.loginDate || toUTCNowForDB(),
                lastLoginIp: "", // IP capture can be implemented with additional libraries
                passwordResetExpires: "", // Clear any existing password reset tokens on successful login
                passwordResetToken: "", // Clear any existing password reset tokens on successful login
                failedLoginAttempts: 0,
                isLockedOut: false,
                lockoutUntil: "",
            });

        return this.createResponse(
            { user: userRes, token: tokenData },
            "Login successful.",
        );
    }

    /**
     * Registers new user with conflict validation and profile initialization
     */
    static async postRegister(
        payload: Partial<IUser>,
    ): Promise<ServiceResponse<IUser | null>> {
        if (!payload.username || !payload.password) {
            return this.createResponse(
                null,
                "Username and password required.",
                false,
                400,
            );
        }

        const existing = await db.users
            .where("username")
            .equalsIgnoreCase(payload.username)
            .first();
        if (existing) {
            return this.createResponse(null, "Username already exists.", false, 409);
        }

        const hashedPassword = await this.encryptPassword(payload.password);

        try {
            const result = await db.transaction(
                "rw",
                [
                    db.users,
                    db.userSecurity,
                    db.userProfiles,
                    db.userWorkplaces,
                    db.userSettings,
                ],
                async () => {
                    const newUser: IUser = {
                        ...payload,
                        guid: generateGuidV2().toUpperCase(),
                        isActive: true,
                        createdDate: toUTCNowForDB(),
                        password: hashedPassword,
                    } as IUser;

                    if (userApi.useStaticData) {
                        const userId = (await db.users.add({
                            ...newUser,
                            nameMiddle: "System",
                            nameLast: "data",
                        })) as number;

                        await db.userSecurity.add({
                            userId,
                            twoFactorEnabled: true,
                            lastLoginDate: toUTCNowForDB(),
                            lastLoginIp: "",
                            failedLoginAttempts: 0,
                            isLockedOut: false,
                        } as IUserSecurity);

                        await db.userProfiles.add({
                            userId,
                            avatarUrl: "",
                            phoneNumber: "123-456-7890",
                            dateOfBirth: "1990-05-05",
                            gender: "male",
                            languagePreference: "en-US",
                            timezone: "America/New_York",
                            addressLine1: "123 Main St",
                            addressLine2: "Apt 4B",
                            city: "Any-town",
                            state: "NY",
                            postalCode: "12345",
                            country: "India",
                        } as IUserProfile);

                        await db.userWorkplaces.add({
                            userId,
                            roleId: 2,
                            designation: "Manager",
                        } as IUserWorkplace);

                        await db.userSettings.add({
                            userId,
                            theme: "light",
                            sidebarCollapsed: false,
                            startPage: "/dashboard",
                            permissions: "view_dashboard,manage_users",
                        } as IUserSettings);

                        return { ...newUser, id: userId, password: "" };
                    } else {
                        const userId = (await db.users.add(newUser)) as number;
                        // Initialize associated tables with empty/static data
                        await db.userSecurity.add({ userId } as IUserSecurity);
                        await db.userProfiles.add({ userId } as IUserProfile);
                        await db.userWorkplaces.add({
                            userId,
                            roleId: 2,
                        } as IUserWorkplace);
                        await db.userSettings.add({ userId } as IUserSettings);
                        return { ...newUser, id: userId, password: "" };
                    }
                },
            );

            return this.createResponse(
                result,
                "User registered successfully.",
                true,
                201,
            );
        } catch (error: unknown) {
            return this.createResponse(null, this.getErrorMessage(error), false, 500);
        }
    }

    /**
     * Validates token and performs silent rotation
     */
    static async postValidateToken(
        tokenStr: string,
    ): Promise<ServiceResponse<{ user: IUser; token: IRefreshToken; } | null>> {
        if (!tokenStr)
            return this.createResponse(null, "Token required.", false, 400);

        const userToken = await db.refreshTokens
            .where("token")
            .equals(tokenStr)
            .first();

        // Validation Checks
        if (!userToken)
            return this.createResponse(null, "Session invalid.", false, 401);
        if (new Date(userToken.expiresAt) < new Date()) {
            await db.refreshTokens.delete(userToken.id!);
            return this.createResponse(null, "Session expired.", false, 401);
        }

        // Device Check
        const device = getDeviceInfo();
        if (device.browser !== userToken.browser || device.os !== userToken.os) {
            await db.refreshTokens.delete(userToken.id!);
            return this.createResponse(
                null,
                "Security mismatch: Device changed.",
                false,
                403,
            );
        }

        const user = await db.users.get(userToken.userId);
        if (!user) return this.createResponse(null, "User not found.", false, 401);

        // Rotate Token for security
        await db.refreshTokens.where("userId").equals(user.id).delete();
        const newToken = await this.createSessionToken(user.id);

        return this.createResponse(
            { user: { ...user, password: "" }, token: newToken },
            "Token refreshed.",
        );
    }

    static async getFullUser(
        userId: number,
    ): Promise<ServiceResponse<IUserFull | null>> {
        const user = await db.users.get(userId);
        if (!user) return this.createResponse(null, "User not found.", false, 401);

        // Run all profile-related DB queries in parallel for performance
        const [security, profile, workplace, settings] = await Promise.all([
            db.userSecurity.where("userId").equals(userId).first(),
            db.userProfiles.where("userId").equals(userId).first(),
            db.userWorkplaces.where("userId").equals(userId).first(),
            db.userSettings.where("userId").equals(userId).first(),
        ]);

        if (security) {
            // Security: Truncate sensitive fields so they are never traced in the frontend payload
            delete security.twoFactorSecret;
            delete security.passwordResetToken;
            delete security.passwordResetExpires;
        }

        const data: IUserFull = {
            ...user,
            password: "",
            security,
            profile,
            workplace,
            settings,
        };

        if (data.workplace && data.workplace.roleId) {
            data.role = await db.roles.get(data.workplace.roleId);
        }

        return this.createResponse(data, "User retrieved.");
    }

    // Update specific profile data
    static async updateProfile(
        userId: number,
        payload: Partial<IUserProfile>,
    ): Promise<ServiceResponse<IUserProfile | null>> {
        const existingProfile = await db.userProfiles
            .where("userId")
            .equals(userId)
            .first();
        if (!existingProfile) {
            return this.createResponse(null, "User profile not found.", false, 404);
        }
        await db.userProfiles.update(existingProfile.id!, payload);
        return this.createResponse(
            { ...existingProfile, ...payload },
            "User profile updated successfully.",
        );
    }

    // Update specific user settings
    static async updateSettings(
        userId: number,
        payload: Partial<IUserSettings>,
    ): Promise<ServiceResponse<IUserSettings | null>> {
        const existingSettings = await db.userSettings
            .where("userId")
            .equals(userId)
            .first();
        if (!existingSettings) {
            return this.createResponse(null, "User settings not found.", false, 404);
        }
        await db.userSettings.update(existingSettings.id!, payload);
        return this.createResponse(
            { ...existingSettings, ...payload },
            "User settings updated successfully.",
        );
    }

    // Update specific user security
    static async updateSecurity(
        userId: number,
        payload: Partial<IUserSecurity>,
    ): Promise<ServiceResponse<IUserSecurity | null>> {
        const existingSecurity = await db.userSecurity
            .where("userId")
            .equals(userId)
            .first();
        if (!existingSecurity) {
            return this.createResponse(
                null,
                "User security settings not found.",
                false,
                404,
            );
        }
        await db.userSecurity.update(existingSecurity.id!, payload);
        return this.createResponse(
            { ...existingSecurity, ...payload },
            "User security settings updated successfully.",
        );
    }

    // Update specific user workplace
    static async updateWorkplace(
        userId: number,
        payload: Partial<IUserWorkplace>,
    ): Promise<ServiceResponse<IUserWorkplace | null>> {
        const existingWorkplace = await db.userWorkplaces
            .where("userId")
            .equals(userId)
            .first();
        if (!existingWorkplace) {
            return this.createResponse(null, "User workplace not found.", false, 404);
        }
        await db.userWorkplaces.update(existingWorkplace.id!, payload);
        return this.createResponse(
            { ...existingWorkplace, ...payload },
            "User workplace updated successfully.",
        );
    }

    /**
     * Updates multiple user-related tables in a single transaction
     */
    static async updateFullProfile(
        userId: number,
        payload: {
            user: Partial<IUser>;
            profile: Partial<IUserProfile>;
            workplace: Partial<IUserWorkplace>;
        },
    ): Promise<ServiceResponse<boolean>> {
        try {
            if (userId !== payload.user.id) {
                return this.createResponse(false, "User not found.", false, 401);
            }

            await db.transaction(
                "rw",
                [db.users, db.userProfiles, db.userWorkplaces],
                async () => {
                    await db.users.update(userId, {
                        nameFirst: payload.user.nameFirst,
                        nameMiddle: payload.user.nameMiddle,
                        nameLast: payload.user.nameLast,
                    });

                    const existingProfile = await db.userProfiles
                        .where("userId")
                        .equals(userId)
                        .first();
                    if (existingProfile) {
                        await db.userProfiles.update(existingProfile.id!, {
                            avatarUrl: payload.profile.avatarUrl,
                            phoneNumber: payload.profile.phoneNumber,
                            gender: payload.profile.gender,
                            dateOfBirth: payload.profile.dateOfBirth,
                            addressLine1: payload.profile.addressLine1,
                            addressLine2: payload.profile.addressLine2,
                            city: payload.profile.city,
                            state: payload.profile.state,
                            postalCode: payload.profile.postalCode,
                            country: payload.profile.country,
                        });
                    }

                    const existingWorkplace = await db.userWorkplaces
                        .where("userId")
                        .equals(userId)
                        .first();
                    if (existingWorkplace) {
                        await db.userWorkplaces.update(existingWorkplace.id!, {
                            designation: payload.workplace?.designation,
                        });
                    }
                },
            );
            return this.createResponse(true, "Profile updated successfully.");
        } catch (error: unknown) {
            return this.createResponse(
                false,
                this.getErrorMessage(error),
                false,
                500,
            );
        }
    }

    /**
     * Updates password and 2FA
     */
    static async updatePassword(
        userId: number,
        oldPassword: string,
        newPassword: string,
    ): Promise<ServiceResponse<boolean>> {
        try {
            if (!userId) {
                return this.createResponse(false, "User not found.", false, 401);
            }

            const user = await db.users.where("id").equals(userId).first();
            const hashedInput = await this.encryptPassword(oldPassword);

            if (!user || user.password !== hashedInput) {
                return this.createResponse(
                    false,
                    "Invalid username or password.",
                    false,
                    401,
                );
            }

            const hashedPassword = await this.encryptPassword(newPassword);

            await db.users.update(userId, {
                password: hashedPassword,
                updatedBy: userId,
                updatedDate: toUTCNowForDB(),
            });
            return this.createResponse(true, "Password updated successfully.", true, 201);
        } catch (error: unknown) {
            return this.createResponse(
                false,
                this.getErrorMessage(error),
                false,
                500,
            );
        }
    }

    /**
     * Unified response factory
     */
    private static createResponse<T>(
        data: T,
        message: string,
        success: boolean = true,
        status: number = 200,
    ): ServiceResponse<T> {
        return { status, success, message, data };
    }

    /**
     * Internal session generator
     */
    private static async createSessionToken(
        userId: number,
    ): Promise<IRefreshToken> {
        const device = getDeviceInfo();
        const newToken = {
            userId,
            token: generateGuidV2().toUpperCase(),
            expiresAt: toUTCNowForDB(new Date(Date.now() + tokenValidTill)),
            createdAt: toUTCNowForDB(),
            browser: device.browser || "Unknown",
            os: device.os || "Unknown",
            deviceType: device.deviceType || "Unknown",
        };
        const id = await db.refreshTokens.add(newToken as IRefreshToken);
        return { ...newToken, id } as IRefreshToken;
    }

    private static async encryptPassword(password: string): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        return Array.from(new Uint8Array(hashBuffer))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    }
}
