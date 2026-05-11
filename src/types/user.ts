export interface ILoginForm {
    email: string;
    password: string;
}


export interface IRegisterForm {
    username: string;
    password?: string;
    nameFirst: string;
    nameMiddle: string;
    nameLast: string;
    email: string;
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


export interface ILoginHistory {
    id: number;          // Primary key (auto-incremented)
    userId: number;       // reference numeric id
    loginDate: string;    // Timestamp of login
    ipAddress: string;    // IP address of the user during login
    deviceInfo: IDeviceInfo; // Browser/OS/device details
}

export interface IUserSecurity {
    id: number;          // Primary key (auto-incremented)
    userId: number; // Foreign key to IUser.id
    twoFactorEnabled: boolean;
    twoFactorSecret?: string;
    lastLoginDate: string;
    lastLoginIp: string;
    passwordResetToken?: string;
    passwordResetExpires?: string;
    failedLoginAttempts: number;
    isLockedOut: boolean;
    lockoutUntil?: string;
}

export interface IUserProfile {
    id: number;          // Primary key (auto-incremented)
    userId: number;
    avatarUrl?: string;
    phoneNumber: string;
    dateOfBirth?: string;
    gender: string; // 'male' | 'female' | 'other' | 'prefer_not_to_say';
    languagePreference: string; // e.g., 'en-US'
    timezone: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
}

export interface IUserWorkplace {
    id: number;          // Primary key (auto-incremented)
    userId: number;
    roleId: number; // Links to a Roles table
    designation: string; // e.g., 'Cashier', 'Manager', 'Admin'
}

export interface IUserSettings {
    id: number;          // Primary key (auto-incremented)
    userId: number;
    theme: string; // 'light' | 'dark' | 'system';
    sidebarCollapsed: boolean;
    startPage: string; // e.g., '/dashboard' or '/pos'
    permissions: string; // Comma separated of permission keys
}

export interface IUserFull extends IUser {
    security?: IUserSecurity;
    profile?: IUserProfile;
    workplace?: IUserWorkplace;
    settings?: IUserSettings;
    role?: IRole;
}

export interface IRole {
    id: number;          // Primary key (auto-incremented)
    name: string;
    description: string;
    permissions: string; // Comma separated of permission keys
}