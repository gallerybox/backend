import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, {Model, Connection, FilterQuery} from 'mongoose';
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
      .populate(
          [
              { path: "collections",
                  model: "Collection",

                  populate:[{
                      path: "collectibles",
                      model: "Collectible",
                      populate:[
                          {
                              path: 'thematicSpace',
                              model: 'ThematicSpace',
                          },
                          {
                              path: 'user',
                              model: 'Users',
                          }
                      ]
                  },
                  {
                      path: "thematicSpace",
                      model: "ThematicSpace"
                  }
                  ]
              },
          ]
          /*[
          {
            path: "collections.collectibles",
            model: "Collectible",
            populate:[
              {
                path: 'thematicSpace',
                model: 'ThematicSpace',
              },
              {
                path: 'user',
                model: 'Users',
              }
            ]

          },
          ]*/)
      .catch(
        err => []
      );
      return result[0].collections.find((collection: any) => collection._id.toString() === collectionId)
  }



  async getUserByIdCollectionsPopulate(filterQuery: FilterQuery<any>) {

    return await this.model.findOne(filterQuery, {}, {lean: true})
        .populate([
 ,
        ]).populate([
          { path: "collections",
            model: "Collection",

            populate:[{
              path: "collectibles",
              model: "Collectible",
              select: "thematicSpace",
            },
            {
              path: "thematicSpace",
              model: "ThematicSpace"
            }
          ]
          },
        ])
        .populate("ownedThematicSpaces")
        .populate("followedThematicSpaces")
        .populate("followedUsers")
        .then(data => data);
  }

  async findEmail(email: string) {
    return await this.model.find({ email: email }, {}, {lean: true})
        .then(data => data.length === 0 ? null : data[0])
        .catch(error => console.log(error));
  }

  async findUsersByFollowedSpaceId(followedSpaceId: string) {
    return await this.model.find({ followedThematicSpaces: followedSpaceId },
        {}, {lean: true})
        .populate([
            { path: "collections",
                model: "Collection",

                populate:[{
                    path: "collectibles",
                    model: "Collectible",
                    select: "thematicSpace",
                },
                    {
                        path: "thematicSpace",
                        model: "ThematicSpace"
                    }
                ]
            },
        ])
        .then(data => data);

  }
  async findUserOwnerOfSpaceId(ownedSpaceId: string) {
    return await this.model.findOne({ ownedThematicSpaces: ownedSpaceId },
        {}, {lean: true})
        .populate([
            { path: "collections",
                model: "Collection",

                populate:[{
                    path: "collectibles",
                    model: "Collectible",
                    select: "thematicSpace",
                },
                    {
                        path: "thematicSpace",
                        model: "ThematicSpace"
                    }
                ]
            },
        ])
        .then(data => data);

  }
  async findUserByFollowedUserId(userId: string) {
    return await this.model.find({ followedUsers: userId },
        {}, {lean: true})
        .then(data => data);
  }

}