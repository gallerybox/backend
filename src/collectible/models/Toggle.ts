import {DynamicType} from "./DynamicType";
import {ToggleRepresentation, Type} from "../../tematic-spaces/models/Type";

export class Toggle implements DynamicType {

    // Data associated with technical rules
    activate: boolean;

    //Representation
    representation: ToggleRepresentation;

    constructor(type: Type) {
        this.representation = type.representation as ToggleRepresentation;
    }
    represent(): ToggleRepresentation{
        return this.representation;
    }

    save(): Toggle {
        // Do something with amazon S3, this method implementation should be inyected to be clean
        // Dicho de otra manera, esto hace las veces de interfaz, pero no contiene la implementación.
        // Algunos método deberían moverse a DynamicType
        return this;
    }

    read(): Toggle {

        return this;
    }

}