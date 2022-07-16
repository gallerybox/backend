import {Attribute, AttributeSchema} from './Attribute'
import {Schema, Prop, SchemaFactory} from "@nestjs/mongoose";

@Schema()
export class Template {

    @Prop({ type: [AttributeSchema], default: [] })
    public  attributes: Array<Attribute> = [];

    @Prop()
    public name: string;

    @Prop()
    public description: string;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);