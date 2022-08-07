import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Connection } from 'mongoose';
import { AbstractRepository } from '@app/common';
import { Collection, Users } from './schema/users.schema';

@Injectable()
export class UsersRepository extends AbstractRepository<Users> {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectModel(Users.name) userModel: Model<Users>,
    @InjectConnection() connection: Connection,
  ) {
    super(userModel, connection);
  }

  async getCollectionById(collectionId: string) {
    let result = await this.model
      .find(
        {
          "collections._id": collectionId
        }, {}, { lean: true })
      .populate("collections.collectibles")
      .catch(
        err => []
      );

      return result[0].collections.find((collection: any) => collection._id.toString() === collectionId)
        

  }
}