import { HttpStatus } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import request from 'supertest';

import { UserDto } from '../../src/user/dto/user.dto';

export const sendRequest = async (
  app: NestApplication,
  method: string,
  path: string,
  status: HttpStatus,
  user?: Partial<UserDto>,
  query?: Record<string, unknown>,
  body?: string | object,
  header?: Record<'field' | 'val', string>,
) => {
  const req = request(app.getHttpServer());
  let call: request.Test;
  switch (method) {
    case 'get':
      call = req.get(path);
      break;
    case 'delete':
      call = req.delete(path);
      break;
    case 'patch':
      call = req.patch(path);
      break;
    case 'post':
      call = req.post(path);
      break;
    default:
      call = req.get(path);
      break;
  }
  if (user) {
    call.set('authorization', JSON.stringify(user));
  }
  if (query) {
    call.query(query);
  }
  if (body) {
    call.send(body);
  }
  if (header) {
    call.set(header.field, header.val);
  }
  return call.expect(status);
};
