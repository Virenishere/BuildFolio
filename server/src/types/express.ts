import { Request } from "express";

export interface AuthUser {
  id: string;
  email: string;
  userName: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}
