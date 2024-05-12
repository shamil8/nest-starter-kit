import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  /**
   * Use a unique identifier for each user, such as user ID or IP address
   *
   * @param {Record<string, any>} req
   * @returns {Promise<string>}
   * @protected
   */
  protected getTracker(req: Record<string, any>): Promise<string> {
    if (req.user) {
      return req.user.id;
    }

    /** Send ip address */
    if (req.headers['x-forwarded-for']) {
      return req.headers['x-forwarded-for'];
    }

    if (req.headers['X-Forwarded-For']) {
      return req.headers['X-Forwarded-For'];
    }

    return req.ip;
  }
}
