import { HeaderMap } from "./common.type";

export type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    phoneNumber: string;
    birthDate: string;
    membershipLevel: string;
    role: string;
    status: string;
    created_at: Date;
    updated_at: Date;
};

type userHeaders = Omit<User, "birthDate" | "membershipLevel" | "role" | "created_at" | "updated_at">;

export const USER_HEADERS: HeaderMap<userHeaders> = {
    id: "ID",
    username: "Username",
    name: "Name",
    email: "Email",
    phoneNumber: "Phone number",
    status: "status"
};

export type ChangePasswordForm = {
    oldPassword: string;
    newPassword: string;
    reConfirmNewPassword: string;
};

export type UpdateUserForm = {
    email?: string;
    phoneNumber?: string;
    birthDate?: string;
    name?: string;
};
