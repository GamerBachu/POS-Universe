import { type ISystemLog, SystemLogType } from "@/types/systemLog";
import { toUTCNowForDB } from "./helper/dateUtils";
import { systemLogApi } from "@/api/systemLogApi";
import type { ServiceResponse } from "@/types/serviceResponse";

class LoggerUtils {
    /**
     * Private base method to handle the actual logging call.
     * Prevents duplication of payload logic.
     */
    private static async createLog(
        type: string,
        pageName: string,
        functionName: string,
        message: string,
        stackTrace: string = "",
        data: string = ""
    ) {
        const payload: ISystemLog = {
            id: 0,
            type,
            pageName: pageName.trim(),
            functionName: functionName.trim(),
            data: data.trim(),
            timestamp: toUTCNowForDB(),
            message: message.trim(),
            stackTrace: stackTrace.trim(),
        };

        // Fire and forget (or await if you need guaranteed persistence)
        return systemLogApi.add(payload);
    }

    /**
     * Handles unknown errors from try-catch blocks
     */
    static logCatch(
        error: unknown,
        pageName: string,
        functionName: string,
        data: string = ""
    ) {
        const isError = error instanceof Error;
        const message = isError ? error.message : String(error);
        const stackTrace = isError ? error.stack || "" : "";

        this.createLog(SystemLogType.Error, pageName, functionName, message, stackTrace, data);
    }

    /**
     * Handles errors returned from API Service Responses
     */
    static logError(
        error: ServiceResponse<unknown> | undefined,
        pageName: string,
        functionName: string,
        data: string = ""
    ) {
        const message = error?.message || "Undefined error object";

        // Structured stack trace for better visibility in SystemLogTableRow
        const stackTrace = error
            ? `Status: ${error.status} | Success: ${error.success} | Payload: ${JSON.stringify(error.data)}`
            : "No error details provided";

        this.createLog(SystemLogType.Error, pageName, functionName, message, stackTrace, data);
    }

    /**
     * Helper for general info logs (can also be saved to Dexie if needed)
     */
    static logInfo(message: string, context: string, saveToDb: boolean = false) {
        console.info(`[${new Date().toISOString()}] [${context}]`, message);
        if (saveToDb) {
            this.createLog(SystemLogType.Info, context, 'General', message);
        }
    }
}

export default LoggerUtils;