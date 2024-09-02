import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { RequestInterface } from '../../auth/interfaces/request.interface';
import { AddFcmTokenCommand } from '../dto/command/add-fcm-token.command';
import { CountryResource } from '../dto/resource/country.resource';
import { SystemService } from '../services/system.service';

@ApiTags('System')
@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('countries')
  @ApiOperation({
    summary: 'Get all countries',
    description: 'This route can call all users',
  })
  @ApiOkResponse({
    type: CountryResource,
    isArray: true,
    description: 'Got all countries',
  })
  async getCountries(): Promise<CountryResource[]> {
    return this.systemService.getCountries();
  }

  @Post('fcm-token')
  @ApiOperation({
    summary: 'Add Registration Token for Firebase Cloud Messaging',
    description: 'This route can call all users',
  })
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
    description: 'Added new Registration Token',
  })
  async addFcmToken(
    @Request() { user }: RequestInterface,
    @Body() command: AddFcmTokenCommand,
  ): Promise<boolean> {
    return this.systemService.addFcmToken(user, command);
  }
}
