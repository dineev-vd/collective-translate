import User from 'entities/user.entity';
import { Request } from 'express';

export type ExtendedRequest = Request & {
  user: User;
};
