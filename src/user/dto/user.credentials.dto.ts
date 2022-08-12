import { Length, Matches } from 'class-validator';

export class UserCredentialsDto {
  @Length(4, 20)
  @Matches(/^[a-zA-Z0-9/_]*$/)
  username: string;

  @Length(8, 50)
  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])(?=.*💩)\S*$/, {
    // 1 upper 1 lower 1 number 1 special and 1 💩
    message:
      'Password must contain one uppercase and one lowercase letter, one number, one special character, and one 💩',
  })
  password: string;
}
