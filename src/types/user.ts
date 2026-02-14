export interface User {
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

export interface UserToken {
    id: number; // primary key
    userId: number;  // foreign key to User
    token: string;
    validTill: string;
    createdDate: string;
}