import {Multimedia} from "./Multimedia";
import {Representation} from "../../tematic-spaces/models/Type";

export interface DynamicType{
    // Representation

    represent(): Representation;
    save(): DynamicType;
    read(): DynamicType;


}