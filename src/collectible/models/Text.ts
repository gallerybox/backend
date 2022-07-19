import {DynamicType} from "./DynamicType";
import {TextRepresentation, Type} from "../../tematic-spaces/models/Type";

export class Text implements DynamicType {

    // Data associated with technical rules
    textContent: string;

    //Representation
    representation: TextRepresentation;

    constructor(type: Type) {
        this.representation = type.representation as TextRepresentation;
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