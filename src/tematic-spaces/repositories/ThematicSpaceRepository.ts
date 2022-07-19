import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {Injectable} from "@nestjs/common";
import {GenericRepository} from "@app/common/database_simpler/GenericRepository";
import {ThematicSpace } from "../models/ThematicSpace";


@Injectable()
export class ThematicSpaceRepository extends GenericRepository<ThematicSpace>{

    constructor(@InjectModel(ThematicSpace.name) private thematicSpaceModel: Model<ThematicSpace>) {
        super(thematicSpaceModel);
    }

}