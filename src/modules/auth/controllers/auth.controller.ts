import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { authRateLimitOptions } from '../../../constants/rate-limit';
import { ApiAppException } from '../../../dto/resource/app-exception.resource';
import { ExceptionLocalCode } from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
import { AuthCommand } from '../dto/command/auth.command';
import { RefreshTokenCommand } from '../dto/command/refresh-token.command';
import { JwtResponseResource } from '../dto/resource/jwt-response.resource';
import { CustomThrottlerGuard } from '../guards/custom-throttel.guard';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(CustomThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @ApiOperation({
    summary: 'Login user',
    description: 'This route can call all users',
  })
  @Throttle({ default: authRateLimitOptions })
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

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh user tokens',
    description: 'Send refresh token and get a new pair',
  })
  @ApiOkResponse({
    type: JwtResponseResource,
    description: 'Token refreshed successfully',
  })
  async getRefresh(
    @Body() { refresh }: RefreshTokenCommand,
  ): Promise<JwtResponseResource> {
    return this.authService.refreshToken(refresh);
  }
}
