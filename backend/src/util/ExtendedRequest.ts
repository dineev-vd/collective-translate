import User from "entities/User.entity";
import { Request } from "express";

export type ExtendedRequest = Request & {
    user: User;
};