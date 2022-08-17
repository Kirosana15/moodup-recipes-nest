import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserCredentialsDto } from '../user/dto/user.credentials.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() userCredentialsDto: UserCredentialsDto) {
    return this.authService.register(userCredentialsDto);
  }
}
