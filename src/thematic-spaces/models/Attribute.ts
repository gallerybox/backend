import { Type, TypeSchema } from "./Type";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { AbstractDocument } from "@app/common";

// TODO: añadido por mi como prueba
export type AttributeDocument = Attribute & Document;

@Schema()
export class Attribute extends AbstractDocument{
    @Prop({ type: TypeSchema })
    public type: Type;

    @Prop()
    public tag: string;

    @Prop()
    public showTag: boolean;

    @Prop({default: false})
    public showInReducedView: boolean = false;

    @Prop()
    public representationOrder: number;
}

export const AttributeSchema = SchemaFactory.createForClass(Attribute);