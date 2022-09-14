import { applyDecorators } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

export const ApiDefaultResponses = () =>
  applyDecorators(
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiInternalServerErrorResponse({ description: 'Internal server error' }),
  );
