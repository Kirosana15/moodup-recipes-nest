import { User, UserDocument } from './user.schema';
import { UserCredentialsDto , UserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
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
    const user = await this.userModel.findById(id);
    if (user) {
      const newCheck = generateCheck();
      user.check = newCheck;
      await user.save();
      return newCheck;
    }
    return null;
  }
}
