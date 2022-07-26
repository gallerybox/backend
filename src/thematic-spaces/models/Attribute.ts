import {Type, TypeSchema} from "./Type";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema()
export class Attribute {
    @Prop({ type: TypeSchema })
    public type: Type;

    @Prop()
    public tag: string;

    @Prop()
    public showTag: boolean;

    @Prop()
    public representationOrder: number;
}

export const AttributeSchema = SchemaFactory.createForClass(Attribute);