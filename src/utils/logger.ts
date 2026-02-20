import { type ISystemLog, SystemLogType } from "@/types/systemLog";
import { toUTCNowForDB } from "./helper/dateUtils";
import { systemLogApi } from "@/api/systemLogApi";

class loggerUtils {
    static logError(
        error: Error|undefined,
        pageName: string,
        functionName: string,
        data: string = "",
    ) {
        const payload: ISystemLog = {
            id: 0,
            type: SystemLogType.Error,
            pageName: pageName.trim(),
            functionName: functionName.trim(),
            data: data.trim(),
            timestamp: toUTCNowForDB(),
            message: error?.message.trim() || "",
            stackTrace: error?.stack?.trim() || "",
        };
        systemLogApi.add(payload);
    }

    static logInfo(message: string, context: string) {
        console.info(`[${new Date().toISOString()}] [${context}]`, message);
    }
}

export default loggerUtils;
