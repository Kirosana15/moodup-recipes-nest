import { ApiProperty } from '@nestjs/swagger';
import { Length, Matches } from 'class-validator';

const username_match = /^\w*$/;
const password_match = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])\S*$/;

const username_message = [
  'Password must have from 4 to 20 characters',
  'username can only contain letters, numbers and _',
];
const password_message = [
  'Password must have from 8 to 50 characters',
  'password must contain one uppercase and one lowercase letter, one number, one special character',
];

export class UserCredentialsDto {
  @ApiProperty({ description: username_message.join(' and '), example: 'some_user123' })
  @Length(4, 20)
  @Matches(username_match, { message: username_message[1] })
  username: string;

  @ApiProperty({
    description: password_message.join('\t'),
    example: 'Pa$$$w0rd',
  })
  @Length(8, 50)
  @Matches(password_match, {
    message: password_message[1],
  })
  password: string;
}
