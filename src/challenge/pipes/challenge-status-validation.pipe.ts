import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ChallengeStatus } from 'src/challenge/enums/challenge-status.enum';


export class ChallengeStatusValidation implements PipeTransform{
    readonly acceptedStatus = [
        ChallengeStatus.ACCEPT,
        ChallengeStatus.DENIED,
        ChallengeStatus.CANCELED
    ]
    transform(value: any) {
        const status = value.status.toUpperCase()
        if(!this.validStatus(status)){
            throw new BadRequestException(`${status} is invalid status!`)
        }
        return value
    }
    private validStatus ( status: any){
        const valid = this.acceptedStatus.indexOf(status)
        return valid !==-1
    }
}