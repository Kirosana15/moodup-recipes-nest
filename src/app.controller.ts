import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('')
export class AppController {
  @ApiOkResponse({ schema: { default: 'hello' } })
  @Get()
  hello(): 'hello' {
    return 'hello';
  }
}
