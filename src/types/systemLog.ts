export interface ISystemLog {
    id: number;
    type: string;
    pageName: string;
    functionName: string;
    data: string;
    timestamp: string;
    message: string;
    stackTrace: string;
}

export type SystemLogType = 'Error' | 'Warning' | 'Info' | 'Debug';
export const SystemLogTypes: SystemLogType[] = ['Error', 'Warning', 'Info', 'Debug'];