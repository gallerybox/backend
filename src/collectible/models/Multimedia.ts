import {DynamicType, Value} from "./DynamicType";
import {Category, MultimediaRepresentation, Type} from "../../thematic-spaces/models/Type";

export class Multimedia implements DynamicType {

    representationOrder: number;

    showTag: boolean;

    readonly category: Category = Category.Multimedia;
    // Data associated with technical rules
    value: string; // Resource Url

    //Representation
    representation: MultimediaRepresentation;

    // En el value del constructor, recibe el buffer del file, por lo que habrá que cambiarlo
    // para que, en lugar de un Value, reciba el tipo que corresponda al Buffer.
    // Aquí se meterá la lógica de S3.
    // 
    constructor(type: Type, value: Value, representationOrder: number, showTag: boolean) {
        this.representation = type.representation as MultimediaRepresentation;
        this.value = value as string;
        this.representationOrder = representationOrder;
        this.showTag = showTag;
    }
    represent(): MultimediaRepresentation{
        return this.representation;
    }

}