import { ApiProperty } from '@nestjs/swagger';

import { CountryEntity } from '../../entities/country.entity';

export class CountryResource {
  @ApiProperty({
    example: 'JHVYBD1DPUG0',
    description: 'The unique identifier for the country.',
  })
  id!: string;

  @ApiProperty({
    example: 'Austria',
    description: 'The name of the country.',
  })
  name!: string;

  @ApiProperty({
    example: 'EN',
    description: 'The ISO two-letter country code.',
  })
  code!: string;

  @ApiProperty({
    required: false,
    example: '🇦🇹',
    description: 'The emoji flag symbol of the country, if available.',
  })
  sign?: string;

  @ApiProperty({
    required: false,
    example: true,
    description:
      'Indicates whether or not the country is available for selection or use in the application.',
  })
  isAvailable?: boolean;

  constructor(entity: CountryEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.code = entity.code;
    this.sign = entity.sign;
    this.isAvailable = entity.isAvailable;
  }
}
