import { Request } from "express";
export default interface AuthRequest extends Request {
    token?: any;
}
