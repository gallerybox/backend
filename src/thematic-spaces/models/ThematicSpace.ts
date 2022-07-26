import {Template, TemplateSchema} from "./Template";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";
import {AbstractDocument} from "@app/common/database_simpler/AbstractDocument";

export type ThematicSpaceDocument = ThematicSpace & Document;

@Schema()
export class ThematicSpace extends AbstractDocument{

    @Prop({ type: TemplateSchema })
    template: Template;

    @Prop()
    name: string;

    @Prop()
    description: string;


}

export const ThematicSpaceSchema = SchemaFactory.createForClass(ThematicSpace);