export interface ILoginCredentials {
    email: string;
    password: string;
}



export interface IAuthResponse {
    user: IUser;
    token: IRefreshToken;
}

export interface IUser {
    id: number;  // primary key
    guid: string;
    nameFirst: string;
    nameMiddle: string;
    nameLast: string;
    email: string;
    username: string;
    password: string;
    isActive: boolean;
    createdDate: string;
    createdBy: number;
    updatedDate: string;
    updatedBy: number;
    deletedDate: string;
    deletedBy: number;
}

export interface IRefreshToken {
    id: number;          // Primary key (auto-incremented)
    userId: number;       // reference numeric id
    token: string;        // The actual refresh token string
    expiresAt: string;    // Timestamp (Date.now() + duration)
    createdAt: string;    // When the session was created
    browser: string;       // e.g., "Chrome"
    os: string;            // e.g., "Windows 11"
    deviceType: string;    // e.g., "Mobile" or "Desktop"

}

export interface IAuthUser {
    userId: number;       // reference numeric id
    displayName: string;
    username: string;
    roles: string[];
    refreshToken: string;

}

export interface IDeviceInfo {
    browser: string;       // e.g., "Chrome"
    os: string;            // e.g., "Windows 11"
    deviceType: string;    // e.g., "Mobile" or "Desktop"
}