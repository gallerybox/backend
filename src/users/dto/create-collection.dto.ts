import { IsNotEmpty } from "class-validator";
import {ThematicSpace} from "../../thematic-spaces/models/ThematicSpace";

export class CreateCollectionDto {
    @IsNotEmpty()
    userId: string;
    
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    thematicSpace: ThematicSpace;
}
