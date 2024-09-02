import { Request } from 'express';

import { UserCoreResource } from '../../users/dto/resource/user-core.resource';

export interface RequestInterface extends Request {
  user: UserCoreResource;
}
