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

export const SystemLogType = {
    Error: 'Error',
    Warning: 'Warning',
    Info: 'Info',
    Debug: 'Debug',
};

export const SystemLogTypes: string[] = ['Error', 'Warning', 'Info', 'Debug'];