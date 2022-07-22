import {DynamicType, Value} from "./DynamicType";
import {Category, TextRepresentation, Type} from "../../tematic-spaces/models/Type";

export class Text implements DynamicType {

    readonly category: Category = Category.Text;
    // Data associated with technical rules
    value: string; // The text itself

    //Representation
    representation: TextRepresentation;

    constructor(type: Type, value: Value) {
        this.representation = type.representation as TextRepresentation;
        this.value = value as string;
    }
    represent(): TextRepresentation{
        return this.representation;
    }

    save(): Text {
        // Do something with amazon S3, this method implementation should be inyected to be clean
        // Dicho de otra manera, esto hace las veces de interfaz, pero no contiene la implementación.
        // Algunos método deberían moverse a DynamicType
        return this;
    }

    read(): Text {

        return this;
    }

}