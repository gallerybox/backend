import { Connection, Model } from 'mongoose';
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
}