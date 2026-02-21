import type { ServiceResponse } from "@/types/serviceResponse";
import db from "../libs/db/appDb";
import type { IUser, IRefreshToken, IAuthResponse } from "@/types/user";
import { toUTCNowForDB } from "@/utils/helper/dateUtils";
import { generateGuidV2 } from "@/utils/helper/guid";
import { getDeviceInfo, tokenValidTill } from "@/utils";

export class userApi {
    // Standard CRUD
    static async getById(id: number) { return db.users.get(id); }
    static async add(payload: IUser) { return db.users.add(payload); }
    static async update(payload: Partial<IUser>, id: number) { return db.users.update(id, payload); }
    static async delete(id: number) { return db.users.delete(id); }

    /**
     * Terminate user session
     */
    static async postLogout(userId: number | undefined, refreshToken: string | undefined): Promise<ServiceResponse<string>> {
        if (!userId || !refreshToken) {
            return this.createResponse("", "User ID and token required.", false, 400);
        }

        await db.refreshTokens.where("userId").equals(userId).delete();
        return this.createResponse("", "Logged out successfully.");
    }

    /**
     * Authenticates user and initiates session
     */
    static async postLogin(username: string, password: string): Promise<ServiceResponse<IAuthResponse | null>> {
        if (!username || !password) {
            return this.createResponse(null, "Credentials required.", false, 400);
        }

        const user = await db.users.where("username").equalsIgnoreCase(username).first();
        const hashedInput = await this.encryptPassword(password);

        if (!user || user.password !== hashedInput) {
            return this.createResponse(null, "Invalid username or password.", false, 401);
        }

        // Security: Remove password from response
        const userRes = { ...user, password: "" };

        // Rotate Session: Clear old tokens and generate new one
        await db.refreshTokens.where("userId").equals(user.id).delete();
        const tokenData = await this.createSessionToken(user.id);

        return this.createResponse({ user: userRes, token: tokenData }, "Login successful.");
    }

    /**
     * Registers new user with conflict validation
     */
    static async postRegister(payload: Partial<IUser>): Promise<ServiceResponse<IUser | null>> {
        if (!payload.username || !payload.password) {
            return this.createResponse(null, "Username and password required.", false, 400);
        }

        const existing = await db.users.where("username").equalsIgnoreCase(payload.username).first();
        if (existing) {
            return this.createResponse(null, "Username already exists.", false, 409);
        }

        const newUser: IUser = {
            ...payload,
            guid: generateGuidV2().toUpperCase(),
            isActive: true,
            createdDate: toUTCNowForDB(),
            password: await this.encryptPassword(payload.password),
        } as IUser;

        const id = await db.users.add(newUser);
        return this.createResponse({ ...newUser, id, password: "" }, "User registered.", true, 201);
    }

    /**
     * Validates token and performs silent rotation
     */
    static async postValidateToken(tokenStr: string): Promise<ServiceResponse<{ user: IUser; token: IRefreshToken; } | null>> {
        if (!tokenStr) return this.createResponse(null, "Token required.", false, 400);

        const userToken = await db.refreshTokens.where("token").equals(tokenStr).first();

        // Validation Checks
        if (!userToken) return this.createResponse(null, "Session invalid.", false, 401);
        if (new Date(userToken.expiresAt) < new Date()) {
            await db.refreshTokens.delete(userToken.id!);
            return this.createResponse(null, "Session expired.", false, 401);
        }

        // Device Check
        const device = getDeviceInfo();
        if (device.browser !== userToken.browser || device.os !== userToken.os) {
            await db.refreshTokens.delete(userToken.id!);
            return this.createResponse(null, "Security mismatch: Device changed.", false, 403);
        }

        const user = await db.users.get(userToken.userId);
        if (!user) return this.createResponse(null, "User not found.", false, 401);

        // Rotate Token for security
        await db.refreshTokens.where("userId").equals(user.id).delete();
        const newToken = await this.createSessionToken(user.id);

        return this.createResponse({ user: { ...user, password: "" }, token: newToken }, "Token refreshed.");
    }

    /**
     * Unified response factory
     */
    private static createResponse<T>(
        data: T,
        message: string,
        success: boolean = true,
        status: number = 200
    ): ServiceResponse<T> {
        return { status, success, message, data };
    }

    /**
     * Internal session generator
     */
    private static async createSessionToken(userId: number): Promise<IRefreshToken> {
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
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
    }
}