import {Attribute, AttributeSchema} from './Attribute'
import {Schema, Prop, SchemaFactory} from "@nestjs/mongoose";

@Schema()
export class Template {

    @Prop({ type: [AttributeSchema], default: [] })
    public  attributes: Array<Attribute> = [];

}

export const TemplateSchema = SchemaFactory.createForClass(Template);