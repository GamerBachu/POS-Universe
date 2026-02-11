export interface User {
    id: number;  // primary key
    guid: string;
    name: string;
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