import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Connection } from 'mongoose';

let mongod: MongoMemoryServer;
let connection: Connection;

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      connection = (await mongoose.connect(uri)).connection;
      return {
        uri: uri,
        ...options,
      };
    },
  });

export const closeConnections = async () => {
  await connection.dropDatabase();
  await connection.close();
  await mongod.stop();
};
