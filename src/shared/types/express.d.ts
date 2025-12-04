import { Request } from "express";
import { AuthUser } from "../../core/entities/Auth";

export type GoogleUserRequest = Request & { user: AuthUser };
