import { Optional } from '@nestjs/common';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsDate, IsMongoId, IsUrl, Length } from 'class-validator';

export class RecipeEntity {
  @ApiProperty()
  id: string;

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
  createdAt: Date;
}

export class RecipeContentEntity extends PickType(RecipeEntity, ['title', 'imageUrl', 'content']) {}
