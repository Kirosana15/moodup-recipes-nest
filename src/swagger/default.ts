import { applyDecorators } from '@nestjs/common';
import { ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

export const ApiDefaultResponses = () =>
  applyDecorators(
    ApiForbiddenResponse({ description: 'Forbidden' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiInternalServerErrorResponse({ description: 'Internal server error' }),
  );
