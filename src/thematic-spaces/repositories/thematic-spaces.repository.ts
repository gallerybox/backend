import mongoose, { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from "@nestjs/common";
import { ThematicSpace } from "../models/ThematicSpace";
import { AbstractRepository } from '@app/common';


@Injectable()
export class ThematicSpaceRepository extends AbstractRepository<ThematicSpace>{
    protected readonly logger = new Logger(ThematicSpaceRepository.name);

    constructor(
        @InjectModel(ThematicSpace.name) private thematicSpaceModel: Model<ThematicSpace>,
        @InjectConnection() connection: Connection,
    ) {
        super(thematicSpaceModel, connection);
    }

    async getThematicSpacesByIds(userIds: Array<mongoose.Types.ObjectId>) {
        return await this.model.find(
            { "_id": { 
                "$in": new mongoose.Types.ObjectId(...userIds)
            },
        }, {}, { lean: true });
    }

    async removeByTag(tag: string) {
        // const query = this.thematicSpaceModel.find({ _id: '62daca441334ad9783770397' }).where()
        // return this.thematicSpaceRepository.find( { name: { "$regex": "Testing"} });
        return this.thematicSpaceModel.find({}, { name: { "$regex": tag} });
        // return await this.thematicSpaceRepository.find({});
    }

}