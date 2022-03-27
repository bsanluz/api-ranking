import { IsString, IsArray, ArrayMinSize, IsOptional } from "class-validator"
import { Event } from "../interface/category.interface"


export class updateCategoryDto {
    @IsString()    
    @IsOptional()
    description: string

    @IsArray()
    @ArrayMinSize(1)
    events: Array<Event>

}
