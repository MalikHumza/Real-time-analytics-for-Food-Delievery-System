import { USER_ROLES } from "@prisma/client";

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: USER_ROLES | string;
}