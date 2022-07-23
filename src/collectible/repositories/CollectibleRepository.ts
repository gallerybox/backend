import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {Injectable} from "@nestjs/common";
import {GenericRepository} from "@app/common/database_simpler/GenericRepository";
import {Collectible} from "../models/Collectible";


@Injectable()
export class CollectibleRepository extends GenericRepository<Collectible>{

    constructor(@InjectModel(Collectible.name) private thematicSpaceModel: Model<Collectible>) {
        super(thematicSpaceModel);
    }



}