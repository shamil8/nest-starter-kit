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
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiResponsePaginated,
  PageResType,
} from '@app/crypto-utils/decorators/page-response.decorator';

import {
  ExceptionLocalCode,
  setApiDesc,
} from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
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
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created new user',
    type: UserResource,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: setApiDesc(
      ExceptionMessage.EMAIL_EXISTS,
      ExceptionLocalCode.EMAIL_EXISTS,
    ),
  })
  createUser(@Body() command: StoreUserCommand): Promise<UserResource> {
    return this.usersService.createUser(command);
  }
}
