import { User, UserDocument } from './user.schema';
import { UserCredentialsDto, UserDto, UserInfoDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { PaginatedQueryDto } from '../dto/queries.dto';
import { generateCheck } from './helpers/generateCheck';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userCredentialsDto: UserCredentialsDto): Promise<UserDto> {
    const newUser = new this.userModel(userCredentialsDto);
    const user = await newUser.save();
    return user.toObject();
  }

  async getByUsername(username: string): Promise<UserDto | null> {
    return this.userModel.findOne({ username }).lean().exec();
  }

  async getById(id: string): Promise<UserDto | null> {
    return this.userModel.findById(id).lean().exec();
  }

  async refreshToken(id: string): Promise<string | null> {
    const user = await this.userModel.findById(id).exec();
    if (user) {
      const newCheck = generateCheck();
      user.check = newCheck;
      await user.save();
      return newCheck;
    }
    return null;
  }

  getAll(paginatedQueryDto?: Partial<PaginatedQueryDto>): Promise<UserInfoDto[]> {
    const page = paginatedQueryDto?.page || 1;
    const limit = paginatedQueryDto?.limit || 10;
    return this.userModel
      .find({}, '_id username isAdmin createdAt')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ _id: -1 })
      .exec();
  }
}
