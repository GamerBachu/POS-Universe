import type { ServiceResponse } from "@/types/serviceResponse";
import db from "../libs/db/appDb";
import type { User } from "@/types/user";
import { toUTCNowForDB } from "@/utils/helper/dateUtils";
import { generateGuidV2 } from "@/utils/helper/guid";

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

    static async postLogin(username: string, password: string) {
        return db.users
            .where("username")
            .equals(username)
            .and((user) => user.password === password)
            .first();
    }

    static async postRegister(payload: Partial<User>): Promise<ServiceResponse<User>> {
        // 1. Validation (400 Bad Request)
        if (!payload.username || !payload.password) {
            return {
                success: false,
                status: 400,
                message: "Username and password are required.",
                errorCode: "MISSING_FIELDS"
            };
        }

        // 2. Business Logic Check (409 Conflict)
        const existingUser = await db.users.get({ username: payload.username });
        if (existingUser) {
            return {
                success: false,
                status: 409,
                message: "Username already exists.",
                errorCode: "USER_ALREADY_EXISTS"
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
        } as User;

        // 4. Persistence (201 Created)
        await db.users.add(newUser);

        return {
            success: true,
            status: 201,
            message: "User registered successfully.",
            data: newUser
        };
    }
}