import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsNotEmpty } from "class-validator";
import { Player } from '../../player/interface/player.interface';


export class CreateChallengeDto {
    @IsNotEmpty()
    @IsDateString()
    challengeDate: Date

    @IsNotEmpty()
    requester: Player

    @IsArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    players: Array<Player>
}