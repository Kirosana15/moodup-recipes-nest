import { ApiProperty } from '@nestjs/swagger';
import { Length, Matches } from 'class-validator';

const username_match = /^\w*$/;
const password_match = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])(?=.*💩)\S*$/;

const username_message = 'Username can only contain letters, numbers and _';
const password_message =
  'Password must contain one uppercase and one lowercase letter, one number, one special character, and one 💩';

export class UserCredentialsDto {
  @ApiProperty({ description: username_message, example: 'some_user123' })
  @Length(4, 20)
  @Matches(username_match, { message: username_message })
  username: string;

  @ApiProperty({
    description: password_message,
    example: 'Pa$$$w0r💩',
  })
  @Length(8, 50)
  @Matches(password_match, {
    message: password_message,
  })
  password: string;
}
