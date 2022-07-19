import {Multimedia} from "./Multimedia";
import {Representation} from "../../tematic-spaces/models/Type";

export interface DynamicType{

    represent(): Representation;
    save(): DynamicType;
    read(): DynamicType;


}