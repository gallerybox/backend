import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from "@nestjs/common";
import { AbstractRepository } from '@app/common';
import { Attribute } from "../thematic-spaces/models/Attribute";


@Injectable()
export class AttributeRepository extends AbstractRepository<Attribute>{
    protected readonly logger = new Logger(AttributeRepository.name);

    constructor(
        @InjectModel(Attribute.name) private thematicSpaceModel: Model<Attribute>,
        @InjectConnection() connection: Connection,
    ) {
        super(thematicSpaceModel, connection);
    }

}