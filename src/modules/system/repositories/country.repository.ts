import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Direction } from '@app/crypto-utils/enums/repository/direction';
import { LoggerService } from '@app/logger/services/logger.service';
import { Repository } from 'typeorm';

import { ExceptionLocalCode } from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
import { AppHttpException } from '../../../filters/app-http.exception';
import { CountryEntity } from '../entities/country.entity';

@Injectable()
export class CountryRepository {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,
  ) {}

  async findById(countryId: string): Promise<CountryEntity> {
    const country = await this.countryRepository.findOne({
      where: { id: countryId },
    });

    if (country) {
      return country;
    }

    throw new AppHttpException(
      ExceptionMessage.COUNTRY_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      ExceptionLocalCode.COUNTRY_NOT_FOUND,
    );
  }

  async getCountryByCode(code: string): Promise<CountryEntity | null> {
    return this.countryRepository.findOne({ where: { code } });
  }

  async getAllCountries(): Promise<CountryEntity[]> {
    return this.countryRepository.find({
      order: { name: Direction.ASC },
    });
  }
}
