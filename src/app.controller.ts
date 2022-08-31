import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { NoBearerAuth } from './decorators/noBearer';

@Controller('')
export class AppController {
  @NoBearerAuth()
  @ApiOkResponse({ schema: { default: 'hello' } })
  @Get()
  hello(): 'hello' {
    return 'hello';
  }
}
