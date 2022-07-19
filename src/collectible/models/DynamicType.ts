import {Multimedia} from "./Multimedia";
import {Representation, Type} from "../../tematic-spaces/models/Type";

export type Value = string | boolean;

export interface DynamicType{

    value: Value
    representation: Representation;

    represent(): Representation;
    save(): DynamicType;
    read(): DynamicType;


}