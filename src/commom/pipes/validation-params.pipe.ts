import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class paramsValidation implements PipeTransform{
    transform(value: any, metadata: ArgumentMetadata) {
        if (!value){
            throw new BadRequestException(`The value ${metadata.data} not accept null!`)
        }
        return value
    }
}