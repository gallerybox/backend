import {DynamicType, Value} from "./DynamicType";
import {Category, MultimediaRepresentation, Type} from "../../thematic-spaces/models/Type";

export class Multimedia implements DynamicType {

    readonly category: Category = Category.Multimedia;
    // Data associated with technical rules
    value: string; // Resource Url

    //Representation
    representation: MultimediaRepresentation;

    // En el value del constructor, recibe el buffer del file, por lo que habrá que cambiarlo
    // para que, en lugar de un Value, reciba el tipo que corresponda al Buffer.
    // Aquí se meterá la lógica de S3.
    // 
    constructor(type: Type, value: Value) {
        this.representation = type.representation as MultimediaRepresentation;
        this.value = value as string;
    }
    represent(): MultimediaRepresentation{
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