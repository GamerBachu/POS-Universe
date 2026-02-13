import db from "../libs/db/appDb";
import type { User } from "@/types/user";
import { toUTCNowForDB } from "@/utils/helper/dateUtils";

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

    static async postRegister(payload: Partial<User>) {

        payload.name = payload.username; // Set name same as username for simplicity
        payload.email = payload.username;
        payload.isActive = true;
        payload.createdDate = toUTCNowForDB();
        payload.createdBy = 0;

        return db.users.add(payload as User);
    }
}