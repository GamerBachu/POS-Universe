export type ServiceResponse<T = null> = {
    success: boolean;
    status: number;      // Use standard HTTP codes (200, 201, 400, 409, etc.)
    message: string;
    data?: T;            // The actual payload (e.g., the User object)
    errorCode?: string;  // A string constant like 'USER_EXISTS' for logic checks
};