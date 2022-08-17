import { ApiExtraModels, ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { generateMockId, generatePassword, generateUsername } from '../test/mock/user.model.mock';

@ApiExtraModels(UserDto)
export class UserDto {
  @ApiProperty({ example: generateMockId() })
  _id: string;

  @ApiProperty({ example: generateUsername() })
  username: string;

  @ApiProperty({ example: generatePassword() })
  password: string;

  @ApiProperty({ example: false })
  isAdmin: boolean;

  @ApiProperty()
  check: string;

  @ApiProperty({ example: Date.now() })
  createdAt: number;
}

export class UserInfoDto extends OmitType(UserDto, ['password', 'check']) {}
export class UserCredentialsDto extends PickType(UserDto, ['username', 'password']) {}
