import { Body, Controller, Post } from '@nestjs/common';
import { UserCredentialsDto } from '../user/dto/user.credentials.dto';
import { AuthService } from './auth.service';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() userCredentialsDto: UserCredentialsDto) {
    return this.authService.register(userCredentialsDto);
  }
}
