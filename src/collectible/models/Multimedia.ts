import {DynamicType} from "./DynamicType";
import {Representation, Type} from "../../tematic-spaces/models/Type";

export class Multimedia implements DynamicType {

    // Data associated with technical rules
    resourceUrl: string;

    //Representation
    dimensions: Array<number>;//Should limited to two elements
    position: Array<number>; //May a categoric position
    representation: Representation;

    constructor(type: Type) {
        this.representation = type.representation;
    }
    represent(): Representation{
        return this.representation;
    }

    save(): Multimedia {
        // Do something with amazon S3, this method implementation should be inyected to be clean
        // Dicho de otra manera, esto hace las veces de interfaz, pero no contiene la implementación.
        // Algunos método deberían moverse a DynamicType
        return this;
    }

    read(): Multimedia {

        return this;
    }


}