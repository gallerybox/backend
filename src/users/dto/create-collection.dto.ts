import { IsNotEmpty } from "class-validator";

export class CreateCollectionDto {
    @IsNotEmpty()
    userId: string;
    
    @IsNotEmpty()
    name: string;
}
