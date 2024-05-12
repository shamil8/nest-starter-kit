import { ThrottlerOptions } from '@nestjs/throttler/dist/throttler-module-options.interface';
import { timeToMs } from '@app/crypto-utils/functions/time.util';

export const rateLimitOptions: ThrottlerOptions = {
  limit: 200, // count of query
  ttl: timeToMs(5, 'minute'),
};

export const authRateLimitOptions: ThrottlerOptions = {
  limit: 5, // count of query
  ttl: timeToMs(5, 'minute'),
};
