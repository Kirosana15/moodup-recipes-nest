import { Optional } from '@nestjs/common';
import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { IsDate, IsMongoId, IsUrl, Length } from 'class-validator';

export class RecipeDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  @IsMongoId()
  ownerId: string;

  @ApiProperty()
  @Length(3, 20)
  title: string;

  @ApiProperty()
  @Optional()
  @IsUrl()
  imageUrl: string;

  @ApiProperty()
  @Length(20, 1000)
  content: string;

  @ApiProperty()
  @Optional()
  @IsDate()
  createdAt: number;
}

export class RecipeInfoDto extends OmitType(RecipeDto, ['_id']) {}
export class RecipeIdDto extends PickType(RecipeDto, ['_id']) {}
export class RecipeContentDto extends PickType(RecipeDto, ['title', 'imageUrl', 'content']) {}
