import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserCredentialsDto } from './dto/user.credentials.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userCredentialsDto: UserCredentialsDto): Promise<User> {
    const newUser = new this.userModel(userCredentialsDto);
    return newUser.save();
  }

  async getByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username });
  }
}
