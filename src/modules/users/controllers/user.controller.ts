import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import {
  ApiResponsePaginated,
  PageResType,
} from '@app/crypto-utils/decorators/page-response.decorator';

import { authRateLimitOptions } from '../../../constants/rate-limit';
import { ApiAppException } from '../../../dto/resource/app-exception.resource';
import { ExceptionLocalCode } from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
import { CustomThrottlerGuard } from '../../auth/guards/custom-throttel.guard';
import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { StoreUserCommand } from '../dto/command/store-user.command';
import { UserListQuery } from '../dto/query/user-list.query';
import { UserResource } from '../dto/resource/user.resource';
import { UserService } from '../services/user.service';

@ApiTags('Users')
@Controller({ path: 'users' })
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'This route can call all users',
  })
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  @ApiResponsePaginated(UserResource)
  async getUsers(@Query() query: UserListQuery): PageResType<UserResource> {
    return this.usersService.getUsers(query);
  }

  @Post()
  @ApiOperation({
    summary: 'Create user',
    description: 'Route for creating user',
  })
  @UseGuards(CustomThrottlerGuard)
  @Throttle({ default: authRateLimitOptions })
  @ApiOkResponse({
    type: UserResource,
    description: 'Created new user',
  })
  @ApiAppException({
    statusCode: HttpStatus.CONFLICT,
    description: ExceptionMessage.EMAIL_EXISTS,
    localCode: ExceptionLocalCode.EMAIL_EXISTS,
  })
  createUser(@Body() command: StoreUserCommand): Promise<UserResource> {
    return this.usersService.createUser(command);
  }
}
