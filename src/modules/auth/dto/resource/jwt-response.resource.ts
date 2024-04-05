import { ApiProperty } from '@nestjs/swagger';

export class JwtResponseResource {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1Ni',
    description: 'Access JWT token',
    required: true,
  })
  accessToken!: string;

  @ApiProperty({
    example: 'IsInR5cCI6IkpXVCJ9',
    description: 'Refresh JWT token',
    required: true,
  })
  refreshToken!: string;

  constructor(access: string, refresh: string) {
    this.accessToken = access;
    this.refreshToken = refresh;
  }
}
