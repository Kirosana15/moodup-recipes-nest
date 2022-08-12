import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { TOKEN_KEY } from './auth.constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, PassportModule, JwtModule.register({ secret: TOKEN_KEY, signOptions: { expiresIn: '60m' } })],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
