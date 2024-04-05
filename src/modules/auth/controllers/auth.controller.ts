import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  ExceptionLocalCode,
  setApiDesc,
} from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
import { AuthCommand } from '../dto/command/auth.command';
import { JwtResponseResource } from '../dto/resource/jwt-response.resource';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @ApiOperation({
    summary: 'Login user',
    description: 'This route can call all users',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return access and refresh JWT ',
    type: JwtResponseResource,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: setApiDesc(
      ExceptionMessage.WRONG_PASSWORD,
      ExceptionLocalCode.WRONG_PASSWORD,
    ),
  })
  async login(@Body() command: AuthCommand): Promise<JwtResponseResource> {
    return this.authService.login(command);
  }
}
