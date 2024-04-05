import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getUUID } from '@app/crypto-utils/functions/export-settings';
import { DatabaseModule } from '@app/database/database.module';

import { ExceptionMessage } from '../../../enums/exception-message';
import { UserRepository } from '../../users/repositories/user.repository';
import { AuthCommand } from '../dto/command/auth.command';
import { JwtValidatePayloadInterface } from '../interfaces/jwt-validate-payload.interface';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';

interface SignInOptions {
  isBadUser?: boolean;
}

class AuthModuleTest {
  private app!: TestingModule;
  private authController!: AuthController;

  private userRepository!: UserRepository;
  private jwtService!: JwtService;

  run(): void {
    beforeEach(async () => {
      this.app = await Test.createTestingModule({
        imports: [
          DatabaseModule,
          JwtModule.register({
            secret: 'config.auth.jwt.access.secret',
            signOptions: {
              expiresIn: 's',
            },
          }),
          TypeOrmModule.forFeature([UserRepository]),
        ],
        controllers: [AuthController],
        providers: [AuthService],
      }).compile();

      this.authController = this.app.get<AuthController>(AuthController);
      this.userRepository = this.app.get<UserRepository>(UserRepository);
      this.jwtService = this.app.get<JwtService>(JwtService);
    });

    afterEach(async () => {
      this.app.close();
    });

    describe('Auth module', () => {
      describe('Sign in', () => {
        this.signIn({});
        this.signIn({
          isBadUser: true,
        });
      });
    });
  }

  signIn(options: SignInOptions): void {
    let info = 'Should login user';

    if (options.isBadUser) {
      info = 'Should throw "Wrong password"';
    }

    it(info, async () => {
      const user = await this.userRepository.storeUser({
        email: `${getUUID()}@email.com`,
        password: 'password',
        firstName: 'firstName',
        lastName: 'lastName',
      });

      const payload: AuthCommand = {
        email: user.email,
        password: options.isBadUser ? getUUID() : user.password,
      };

      try {
        const response = await this.authController.login(payload);

        if (options.isBadUser) {
          throw new Error('Bad user case error');
        }

        expect(typeof response.accessToken).toBe('string');
        expect(typeof response.refreshToken).toBe('string');

        const jwtPayload = this.jwtService.decode(
          response.accessToken,
        ) as JwtValidatePayloadInterface;

        expect(jwtPayload.id).toBe(user.id);
      } catch (err) {
        if (!(err instanceof HttpException)) {
          throw err;
        }

        if (options.isBadUser) {
          expect(err.getResponse()).toBe(ExceptionMessage.WRONG_PASSWORD);
          expect(err.getStatus()).toBe(HttpStatus.FORBIDDEN);
        }
      }
    });
  }
}

const test = new AuthModuleTest();

test.run();
