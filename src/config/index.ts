import { config } from 'dotenv';

config();

/** Only server environments here!!! */
export default {
  appName: process.env.APP_NAME || 'App-backend',
  appPort: process.env.APP_PORT ? Number(process.env.APP_PORT) : 5000,
  appUrl: process.env.APP_URL || 'localhost',
  isDev: process.env.APP_ENV === 'develop',
  routePrefix: process.env.ROUTE_PREFIX || '/api',
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
  maxBodySize: process.env.MAX_BODY_SIZE || '50mb',

  /** Swagger documentation prefix */
  swaggerPrefix: process.env.SWAGGER_PREFIX,
};
