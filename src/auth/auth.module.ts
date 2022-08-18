import { EXPIRES_IN, TOKEN_KEY } from './auth.constants';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({ secret: TOKEN_KEY, signOptions: { expiresIn: EXPIRES_IN } }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
