import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsMongoId, IsUrl, Length } from 'class-validator';

export class RecipeDto {
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

export type RecipeInfoDto = Omit<RecipeDto, 'id'>;
export type RecipeIdDto = Pick<RecipeDto, 'id'>;
export type RecipeContentDto = Pick<RecipeDto, 'title' | 'imageUrl' | 'content'>;
export type RecipeCreateDto = Omit<RecipeDto, 'id' | 'createdAt'>;
