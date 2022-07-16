import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";


export enum Category {
    Multimedia = "Multimedia",
    Text = "Text",
    Toggle = "Toggle",
    Relation = "Relation",
}

export interface Representation {


}

type Vector2D = [number, number]

@Schema()
export class MultimediaRepresentation implements Representation{

    @Prop()
    dimensions: Vector2D;

    @Prop()
    position: Vector2D;

}

export const MultimediaRepresentationSchema = SchemaFactory.createForClass(MultimediaRepresentation);

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
type Color = RGB | RGBA | HEX;
@Schema()
export class TextRepresentation implements Representation{

    @Prop()
    color: Color;

    @Prop()
    Size: number;

    @Prop()
    font: string;

    @Prop()
    italics: boolean;

    @Prop()
    bold: boolean;

    @Prop()
    maxLength: number;


}
export const TextRepresentationSchema = SchemaFactory.createForClass(TextRepresentation);

export enum ToggleType {
    Switch = "switch",
    Check = "Check",
    Icon = "Icon"
}

Schema()
export class ToggleRepresentation implements Representation {

    @Prop({ type: String, enum: Category })
    toggleType: ToggleType;

    @Prop()
    icon?: string; // Means to be svg image, color could be change

    @Prop()
    colorTrue: Color;

    @Prop()
    colorFalse: Color;

}

export const ToggleRepresentationSchema = SchemaFactory.createForClass(ToggleRepresentation);


@Schema()
export class Type {

    @Prop({ type: String, enum: Category })
    category: Category;

    @Prop() // TODO: No sé si funcionará con las distintas implementaciones de la interfaz
    representation: Representation;

}

export const TypeSchema = SchemaFactory.createForClass(Type);







