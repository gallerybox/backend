import { Connection, FilterQuery, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from "@nestjs/common";
import { Collectible } from "../models/Collectible";
import { AbstractRepository } from '@app/common';
import { UsersRepository } from 'src/users/users.repository';


@Injectable()
export class CollectibleRepository extends AbstractRepository<Collectible>{
    protected readonly logger = new Logger(UsersRepository.name);

    constructor(
        @InjectModel(Collectible.name) private collectibleModel: Model<Collectible>,
        @InjectConnection() connection: Connection,
    ) {
        super(collectibleModel, connection);
    }


    async getTimeline(usersId: Array<string>, thematicSpaceIds: Array<string>) {
        return await this.model.find({
            "$or": [
                { "user_id": 
                    { 
                        "$in": usersId
                    },
                },
                { "space_id": 
                    { 
                        "$in": thematicSpaceIds 
                    }
                }
            ]
        }, {}, { lean: true });
    }

    async getTimelineByThematicSpaceId(thematicSpaceIds: string) {
        return await this.model.find({
            thematicSpace: thematicSpaceIds
        }, {}, { lean: true })
            .sort('-lastModified')
            .then(thematicSpace => thematicSpace)
            .catch(err => console.log(err));
    } 

    /**
     * {
            "$or": [
            { "user_id": { "$in": userIdList },
            { "space_id": { "$in": spacesIdList }
        ]
        }
     */
}