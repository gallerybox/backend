import {Template, TemplateSchema} from "./Template";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";
import { AbstractDocument } from "@app/common";

export type ThematicSpaceDocument = ThematicSpace & Document;

const template: Template = new Template();
template.attributes = [];
@Schema()
export class ThematicSpace extends AbstractDocument{

    @Prop({ type: TemplateSchema,  default: template})
    template: Template;

    @Prop()
    name: string;

    @Prop()
    description: string;


}

export const ThematicSpaceSchema = SchemaFactory.createForClass(ThematicSpace);