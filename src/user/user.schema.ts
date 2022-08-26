import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Roles } from '../auth/enums/roles';
import { generateCheck } from './helpers/generateCheck';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: [Roles.User] })
  roles: Roles[];

  @Prop({ default: generateCheck() })
  check: string;

  @Prop({ default: Date.now() })
  createdAt: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
