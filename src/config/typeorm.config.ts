import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

import { databaseConfig } from '../../libs/database/src/config/database.config';

config();

const configService = new ConfigService();

export default new DataSource(databaseConfig(configService));
