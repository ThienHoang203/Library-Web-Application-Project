export type LoginType = {
    username: string;
    password: string;
};
export type ChangePasswordType = {
    oldPassword: string;
    newPassword: string;
};
export type RegisterType = {
    name: string;
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    phoneNumber: string;
    birthDate: Date;
};
export type UpdateUserType = Partial<Omit<RegisterType, "format">>;

export type TokenPayloadType = {
    membershipLevel: string | null;
    role: string;
    userId: string;
    iat: number;
    exp: number;
};
