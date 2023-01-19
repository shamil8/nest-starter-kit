import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { wrongRequestApiResource } from '@app/crypto-utils/documentation/wrong-request-api-response';

import { UserService } from '../services/user.service';
import { StoreUserCommand } from '../dto/command/store-user.command';
import { UserDto } from '../dto/resource/user.dto';
import { UserListQuery } from '../dto/query/user-list.query';

@ApiTags('Users')
@Controller({
  path: 'users',
  // host: '127.0.0.1',
})
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Get all users',
    type: [UserDto],
  })
  @ApiResponse(wrongRequestApiResource)
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getUsers(@Query() query: UserListQuery): Promise<UserDto[]> {
    return this.usersService.getUsers(query);
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 200,
    description: 'Create new user',
    type: [UserDto],
  })
  @ApiResponse(wrongRequestApiResource)
  @Post()
  createUser(@Body() command: StoreUserCommand): Promise<UserDto> {
    return this.usersService.createUser(command);
  }
}
