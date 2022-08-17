import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserCredentialsDto } from './dto/user.dto';
import { UserDto } from './dto/user.dto';
import { User, UserDocument } from './user.schema';

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
}
