import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './user/user.module';
import config from '../config/config';

@Module({
  imports: [ConfigModule.forRoot({ load: [config], isGlobal: true }), UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
