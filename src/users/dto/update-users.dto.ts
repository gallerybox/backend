import { PartialType } from '@nestjs/mapped-types';
import mongoose from 'mongoose';
import { Collection } from '../schema/users.schema';
import { CreateUsersDto } from './create-users.dto';

export class UpdateUsersDto extends PartialType(CreateUsersDto) {
    followedUsers: Array<string>;
    ownedThematicSpaces: Array<string>;
    followedThematicSpaces: Array<string>;
    collections: Collection[]= []; 
}
