import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthCommand } from '../dto/command/auth.command';
import { JwtResponseInterface } from '../interfaces/jwt-response.interface';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly authService!: AuthService;

  @Post('sign-in')
  @ApiOperation({ description: 'Login' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() user: AuthCommand): Promise<JwtResponseInterface> {
    return this.authService.login(user);
  }
}
