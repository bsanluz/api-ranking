import { Document } from 'mongoose';
import { ChallengeStatus } from 'src/challenge/enums/challenge-status.enum';
import { Player } from '../../player/interface/player.interface';

export interface Challenge extends Document{
    challengeDate : Date
    requestDate: Date
    status: ChallengeStatus
    replyDate: Date
    requester: Player
    category: string
    players: Array<Player>
    match: Match
}
export interface Match extends Document{
    category: string
    players: Array<Player>
    challenger: Player
    result : Array<Result>
}

export interface Result {
    set: string
}
