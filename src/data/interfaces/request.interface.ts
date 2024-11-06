import { Request } from "express";
import { AuthUser } from "./auth.interface";

export interface RequestWithUser extends Request {
    user: AuthUser;
}
