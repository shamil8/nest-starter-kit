export type ExceptionMsgType = ExceptionMessage | string[];

export enum ExceptionMessage {
  // common
  ACCESS_DENIED = 'Access denied',
  INVALID_DATA = 'Invalid input data',
  TO_MANY_ATTEMPTS = 'Too many attempts',
  REDIS_CLIENT_CONNECTION_FAILED = 'Redis client connection failed',

  // user
  USER_NOT_FOUND = 'User not found',
  USER_NAME_EXISTS = 'Username already exists',
  EMAIL_EXISTS = 'Email already exists',
  NOT_CONFIRMED_EMAIL = 'Not confirmed email in social',

  // auth
  AUTH_WRONG_TOKEN = 'Auth wrong token',
  WRONG_PASSWORD = 'Wrong email or password',
  CODE_TIME_EXPIRED = 'Code time expired',
  ADMIN_RESTRICTED = 'This operation is permitted to admins only',

  // country
  COUNTRY_NOT_FOUND = 'Country not found',
  COUNTRY_NOT_AVAILABLE = 'Country not available for registration',
}
