import { Controller, Get } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiResponse } from '@nestjs/swagger';

@Controller('')
export class AppController {
  @ApiOkResponse({ schema: { default: 'hello' } })
  @Get()
  hello(): 'hello' {
    return 'hello';
  }
}
