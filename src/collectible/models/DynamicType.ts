import {Multimedia} from "./Multimedia";
import {Category, Representation, Type} from "../../thematic-spaces/models/Type";

export type Value = string | boolean;

export interface DynamicType{
    representationOrder: number;
    showTag: boolean
    category: Category;
    value: Value
    representation: Representation;

    represent(): Representation;

}