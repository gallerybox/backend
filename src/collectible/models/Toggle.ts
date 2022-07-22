import {DynamicType, Value} from "./DynamicType";
import {Category, ToggleRepresentation, Type} from "../../tematic-spaces/models/Type";

export class Toggle implements DynamicType {

    readonly category: Category = Category.Toggle;
    // Data associated with technical rules
    value: boolean = false;

    //Representation
    representation: ToggleRepresentation;

    constructor(type: Type, value: Value) {
        this.representation = type.representation as ToggleRepresentation;
        this.value = value as boolean;
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