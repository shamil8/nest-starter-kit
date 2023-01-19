import { Request } from 'express';

import { UserEntity } from '../../users/entities/user.entity';

export interface RequestInterface extends Request {
  user: UserEntity;
}
