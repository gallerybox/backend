import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from 'mongoose';
import { Collectible } from "src/collectible/models/Collectible";
import { ThematicSpace, ThematicSpaceSchema } from "src/thematic-spaces/models/ThematicSpace";

@Schema()
export class Collection {

    name: string;

    @Prop({ 
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Collectible',
        default: []
    })
    collectibles: Array<Collectible> = [];
}

export type CollectionDocument = Collection & Document;

export const CollectionSchema = SchemaFactory.createForClass(Collection);

export type UsersDocument = Users & Document;

@Schema()
export class Users extends AbstractDocument {

    @Prop()             // Dato personal
    nombre?: string;

    @Prop()             // Dato personal
    apellidos?: string;

    @Prop({ required: true })            
    nickname: string;

    @Prop({ required: true })
    email:string;

    @Prop({ required: true })
    password: string;

    @Prop()
    isPrivate: boolean;

    @Prop({ 
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Users',
        default: []
    })
    followedUsers: Array<Users> = [];

    @Prop({
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'ThematicSpace',
        default: []
    })
    ownedThematicSpaces: Array<ThematicSpace> = [];

    @Prop({
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'ThematicSpace',
        default: []
    })
    followedThematicSpaces: Array<ThematicSpace> = [];

    @Prop({
        type: [CollectionSchema],
        default: []
    })
    collections: Array<Collection> = [];
}

// Esquema con el que vamos a interactuar (findOne, findAll)
export const UsersSchema = SchemaFactory.createForClass(Users);