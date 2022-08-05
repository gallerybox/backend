import { Connection, Model } from 'mongoose';
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

}