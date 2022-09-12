import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { PaginatedResults } from '../../dto/paginatedResults.dto';
import { RecipeEntity } from '../model/recipe.entity';

export const ApiOkPaginatedResults = () =>
  applyDecorators(
    ApiExtraModels(RecipeEntity, PaginatedResults),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResults) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(RecipeEntity) },
              },
            },
          },
        ],
      },
    }),
    ApiBadRequestResponse({
      schema: {
        example: {
          statusCode: 400,
          message: ['page must be a number conforming to the specified constraints'],
          error: 'Bad Request',
        },
        properties: {
          statusCode: { type: 'number' },
          message: { type: 'string' },
          error: { type: 'string' },
        },
      },
    }),
  );
