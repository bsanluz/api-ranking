import { IsNotEmpty } from 'class-validator';
import { Player } from '../../player/interface/player.interface';
import { Result } from '../interface/challenge.interface';


export class AssignMatchToChallengeDto{
    @IsNotEmpty()
    def: Player

    @IsNotEmpty()
    result: Array<Result>
}