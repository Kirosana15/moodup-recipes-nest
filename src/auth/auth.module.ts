import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { TOKEN_KEY } from './auth.constants';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, PassportModule, JwtModule.register({ secret: TOKEN_KEY, signOptions: { expiresIn: '60m' } })],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
