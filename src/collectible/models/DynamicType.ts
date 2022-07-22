import {Multimedia} from "./Multimedia";
import {Category, Representation, Type} from "../../tematic-spaces/models/Type";

export type Value = string | boolean;

export interface DynamicType{

    category: Category;
    value: Value
    representation: Representation;

    represent(): Representation;
    save(): DynamicType;
    read(): DynamicType;


}