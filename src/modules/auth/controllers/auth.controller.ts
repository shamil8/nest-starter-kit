import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiAppException } from '../../../dto/resource/app-exception.resource';
import { ExceptionLocalCode } from '../../../enums/exception-local-code';
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
  @ApiOkResponse({
    type: JwtResponseResource,
    description: 'Return access and refresh JWT',
  })
  @ApiAppException({
    statusCode: HttpStatus.FORBIDDEN,
    description: ExceptionMessage.WRONG_PASSWORD,
    localCode: ExceptionLocalCode.WRONG_PASSWORD,
  })
  async login(@Body() command: AuthCommand): Promise<JwtResponseResource> {
    return this.authService.login(command);
  }
}
