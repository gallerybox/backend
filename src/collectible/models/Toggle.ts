import {DynamicType, Value} from "./DynamicType";
import {Category, ToggleRepresentation, Type} from "../../thematic-spaces/models/Type";

export class Toggle implements DynamicType {

    representationOrder: number;

    showTag: boolean;

    showInReducedView: boolean;

    readonly category: Category = Category.Toggle;
    // Data associated with technical rules
    value: boolean = false;

    //Representation
    representation: ToggleRepresentation;

    constructor(type: Type, value: Value, representationOrder: number, showTag: boolean, showInReducedView: boolean) {
        this.representation = type.representation as ToggleRepresentation;
        this.value = value as boolean;
        this.representationOrder = representationOrder;
        this.showTag = showTag;
        this.showInReducedView = showInReducedView;
    }
    represent(): ToggleRepresentation{
        return this.representation;
    }

}