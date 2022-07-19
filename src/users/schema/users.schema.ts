import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type UsersDocument = Users & Document;

@Schema()
export class Users extends AbstractDocument {

    // @Prop()             // Dato personal
    // nombre: string;

    // @Prop()             // Dato personal
    // apellidos: string;

    @Prop({ required: true })            
    nickname: string;

    @Prop({ required: true })
    email:string;

    @Prop({ required: true })
    password: string;

    @Prop()
    isPrivate: boolean;

    /** Faltan:
     * Fecha nacimiento:        // Dato personal
     * Collecciones
     * Espacios temáticos propios
     * Espacios temáticos en los que participa
     * Usuarios seguidos
     */
}

// Esquema con el que vamos a interactuar (findOne, findAll)
export const UsersSchema = SchemaFactory.createForClass(Users);