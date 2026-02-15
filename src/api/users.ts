import type { ServiceResponse } from "@/types/serviceResponse";
import db from "../libs/db/appDb";
import type { User, UserToken } from "@/types/user";
import { toUTCNowForDB } from "@/utils/helper/dateUtils";
import { generateGuidV2 } from "@/utils/helper/guid";
import { tokenValidTill } from "@/utils";

export class userApi {
    static async get(id: number) {
        return db.users.get(id);
    }

    static async post(payload: Partial<User>) {
        return db.users.add(payload as User);
    }

    static async put(payload: Partial<User>, id: number) {
        return db.users.update(id, payload as User);
    }

    static async delete(id: number) {
        return db.users.delete(id);
    }

    static async postLogout(
        username: string | undefined,
        guid: string | undefined,
    ): Promise<ServiceResponse<string>> {
        // 1. Validation (400 Bad Request)
        if (!username || !guid) {
            return {
                success: false,
                status: 400,
                message: "Username and password are required.",
                errorCode: "MISSING_FIELDS",
            };
        }

        // 2. Business Logic Check (404 Not Found)
        const user = await db.users
            .where("username").equals(username)
            .and(user => user.guid === guid)
            .first();
        if (!user) {
            return {
                success: false,
                status: 404,
                message: "User not found.",
                errorCode: "USER_NOT_FOUND",
            };
        }

        // Invalidate existing tokens for the user
        await db.userTokens.where("userId").equals(user.id).delete();

        // 4. Success (200 OK)
        return {
            success: false,
            status: 200,
            message: "Login successful.",
            data: "",
        };
    }


    static async postLogin(
        username: string,
        password: string,
    ): Promise<ServiceResponse<{ user: User; token: UserToken; }>> {
        // 1. Validation (400 Bad Request)
        if (!username || !password) {
            return {
                success: false,
                status: 400,
                message: "Username and password are required.",
                errorCode: "MISSING_FIELDS",
            };
        }

        // 2. Business Logic Check (404 Not Found)
        const user = await db.users.where("username").equals(username).first();
        if (!user) {
            return {
                success: false,
                status: 404,
                message: "User not found.",
                errorCode: "USER_NOT_FOUND",
            };
        }

        // 3. Authentication Check (401 Unauthorized)
        if (user.password !== await this.encryptPassword(password)) {
            return {
                success: false,
                status: 401,
                message: "Invalid credentials.",
                errorCode: "INVALID_CREDENTIALS",
            };
        }

        user.password = ""; // Clear password before returning user data

        //  create token and refresh token here if needed, for now we just return the user data

        // Invalidate existing tokens for the user
        await db.userTokens.where("userId").equals(user.id).delete();

        // Create a new token for the user
        const newToken = {
            userId: user.id,
            token: generateGuidV2().toUpperCase(),
            validTill: toUTCNowForDB(new Date(Date.now() + tokenValidTill)), // token valid for 1 hour
            createdDate: toUTCNowForDB(),
        };
        const d = await db.userTokens.add(newToken);
        // 4. Success (200 OK)
        return {
            success: false,
            status: 200,
            message: "Login successful.",
            data: {
                user,
                token: { ...newToken, id: d } as UserToken,
            },
        };
    }

    static async postRegister(
        payload: Partial<User>,
    ): Promise<ServiceResponse<User>> {
        // 1. Validation (400 Bad Request)
        if (!payload.username || !payload.password) {
            return {
                success: false,
                status: 400,
                message: "Username and password are required.",
                errorCode: "MISSING_FIELDS",
            };
        }

        // 2. Business Logic Check (409 Conflict)
        const existingUser = await db.users.get({ username: payload.username });
        if (existingUser) {
            return {
                success: false,
                status: 409,
                message: "Username already exists.",
                errorCode: "USER_ALREADY_EXISTS",
            };
        }

        // 3. Data Preparation
        const newUser: User = {
            ...payload,
            guid: generateGuidV2().toUpperCase(),
            nameFirst: payload.nameFirst || "",
            isActive: true,
            createdDate: toUTCNowForDB(),
            createdBy: 0,
            password: await this.encryptPassword(payload.password || ""),
        } as User;

        // 4. Persistence (201 Created)
        await db.users.add(newUser);

        return {
            success: true,
            status: 201,
            message: "User registered successfully.",
            data: newUser,
        };
    }



    static async postValidateToken(token: string, device: string,): Promise<ServiceResponse<{ user: User; token: UserToken; }>> {
        // 1. Validation (400 Bad Request)
        if (!token || !device) {
            return {
                success: false,
                status: 400,
                message: "Username and password are required.",
                errorCode: "MISSING_FIELDS",
            };
        }

        // 2. Business Logic Check (404 Not Found)
        const userToken = await db.userTokens.where("token").equals(token).first();
        if (!userToken) {
            return {
                success: false,
                status: 404,
                message: "User not found.",
                errorCode: "USER_NOT_FOUND",
            };
        }

        // 3. validate user
        const user = await db.users.get(userToken.userId);
        if (!user) {
            return {
                success: false,
                status: 401,
                message: "Invalid credentials.",
                errorCode: "INVALID_CREDENTIALS",
            };
        }

        user.password = ""; // Clear password before returning user data

        //  create token and refresh token here if needed, for now we just return the user data

        // Invalidate existing tokens for the user
        await db.userTokens.where("userId").equals(user.id).delete();

        // Create a new token for the user
        const newToken = {
            userId: user.id,
            token: generateGuidV2().toUpperCase(),
            validTill: toUTCNowForDB(new Date(Date.now() + tokenValidTill)), // token valid for 1 hour
            createdDate: toUTCNowForDB(),
        };
        const d = await db.userTokens.add(newToken);
        // 4. Success (200 OK)
        return {
            success: false,
            status: 200,
            message: "Login successful.",
            data: {
                user,
                token: { ...newToken, id: d } as UserToken,
            },
        };
    }


    /**
     * Hashes a password using the native Web Crypto API (SHA-256).
     * This ensures that even if the IndexedDB is exported,
     * the actual passwords remain protected.
     */
    private static async encryptPassword(password: string): Promise<string> {
        // 1. Convert the password string into an array of bytes (Uint8Array)
        const encoder = new TextEncoder();
        const data = encoder.encode(password);

        // 2. Use the Web Crypto API to generate a SHA-256 hash
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);

        // 3. Convert the ArrayBuffer to a Hexadecimal string for storage in Dexie
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

        return hashHex;
    }
}
