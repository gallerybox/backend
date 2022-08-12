import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose from "mongoose";


export enum Category {
    Multimedia = "Multimedia",
    Text = "Text",
    Toggle = "Toggle"
}

export interface Representation {


}

type Vector2D = [number, number]

export enum MultimediaType {
    Video = "Video",
    Audio = "Audio",
    Photo = "Photo"
}

@Schema()
export class MultimediaRepresentation implements Representation{

    @Prop({ type: [Number], default: [20, 20] })
    dimensions: Vector2D;


    @Prop({ type: String, enum: MultimediaType })
    multimediaType: MultimediaType;

}

export const MultimediaRepresentationSchema = SchemaFactory.createForClass(MultimediaRepresentation);

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
type Color = RGB | RGBA | HEX;
@Schema()
export class TextRepresentation implements Representation{

    @Prop(String)
    color: Color;

    @Prop()
    size: number;

    @Prop()
    font: string;

    @Prop()
    italics: boolean;

    @Prop()
    underlined: boolean;

    @Prop()
    bold: boolean;

}
export const TextRepresentationSchema = SchemaFactory.createForClass(TextRepresentation);

export enum ToggleType {
    Switch = "Switch",
    Check = "Check",
    Icon = "Icon"
}

Schema()
export class ToggleRepresentation implements Representation {

    @Prop({ type: String, enum: ToggleType })
    toggleType: ToggleType;

    @Prop()
    icon?: string; // Means to be svg image, color could be change

    @Prop(String)
    colorTrue: Color;

    @Prop(String)
    colorFalse: Color;

}

export const ToggleRepresentationSchema = SchemaFactory.createForClass(ToggleRepresentation);


@Schema()
export class Type {

    @Prop({ type: String, enum: Category })
    category: Category;

    @Prop({type: mongoose.Schema.Types.Mixed}) // TODO: No sé si funcionará con las distintas implementaciones de la interfaz
    representation: Representation;

}

export const TypeSchema = SchemaFactory.createForClass(Type);







