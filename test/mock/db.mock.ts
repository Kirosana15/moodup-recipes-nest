import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Connection } from 'mongoose';

let mongod: MongoMemoryServer;
let mongoConnection: Connection;

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      mongoConnection = (await mongoose.connect(uri)).connection;
      return {
        uri: uri,
        ...options,
      };
    },
  });

export const closeConnections = async () => {
  await mongoConnection.dropDatabase();
  await mongoConnection.close();
  await mongod.stop();
};
