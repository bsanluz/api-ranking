import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { Challenge, Match } from './interface/challenge.interface';
import { Model } from 'mongoose';
import { PlayerService } from '../player/player.service';
import { CategoryService } from '../category/category.service';
import { ChallengeStatus } from '../challenge/enums/challenge-status.enum';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { AssignMatchToChallengeDto } from './dto/assign-match-challenge.dto';

@Injectable()
export class ChallengeService {
    constructor(
        @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
        @InjectModel('Match') private readonly matchModel: Model<Match>,
        private readonly playerService : PlayerService,
        private readonly categoryService: CategoryService
    ){}

    async createChallenge(createChallengeDto: CreateChallengeDto): Promise<Challenge>{     
        const players = await this.playerService.searchAllPlayers()
        createChallengeDto.players.map(playerDto =>{
            const playerFilter = players.filter(player => player._id == playerDto._id)
            if(playerFilter.length == 0){
                throw new BadRequestException(`Id ${playerDto._id} is not a valid player!`)
            }
        })

        const requesterIsPlayerFromMatch = await createChallengeDto.players.filter(player => player._id == createChallengeDto.requester)
        if (requesterIsPlayerFromMatch.length == 0){
            throw new BadRequestException('The requester need be a player from match!')
        }

        const categoryFromPlayer = await this.categoryService.searchCategoryFromPlayer(createChallengeDto.requester)
        if(!categoryFromPlayer){
            throw new BadRequestException('The requester need be already registared on category')
        }

        const challengeCreated = new this.challengeModel(createChallengeDto)
        challengeCreated.category = categoryFromPlayer.category
        challengeCreated.requestDate = new Date()
        challengeCreated.status = ChallengeStatus.PENDING
        return await challengeCreated.save()
    }
    
    async searchAllChallenges():Promise<Array<Challenge>>{
        return await this.challengeModel.find().populate('requester').populate('players').populate('match').exec()
    }

    async searchChallengesOfPlayer(playerId: any):Promise<Array<Challenge>>{
        const players = await this.playerService.searchAllPlayers()
        const playerFilter = players.filter(player => player._id == playerId)
        if(playerFilter.length == 0){
            throw new BadRequestException(`Id ${playerId} is not a valid player!`)
        }
        return await this.challengeModel.find().where('players').in(playerId).populate('requester').populate('players').populate('match').exec()
    }

    async updateChallenge(challengeId: string, updateChallengeDto: UpdateChallengeDto): Promise<void>{
        const challengeFound = await this.challengeModel.findById({challengeId}).exec()
        if (!challengeFound){
            throw new BadRequestException(`Challenge ${challengeId} not found to update!`)
        }
        if(updateChallengeDto.status){
            challengeFound.replyDate = new Date()
        } 
        challengeFound.status = updateChallengeDto.status
        challengeFound.challengeDate = updateChallengeDto.challengeDate
        await this.challengeModel.findOneAndUpdate({_id: challengeId},{$set: challengeFound}).exec()
    }

    async assignMatchToChallenge(challengeId: string, assignMatchToChallenge : AssignMatchToChallengeDto): Promise<void>{
        const challengeFound  = await this.challengeModel.findById({challengeId}).exec()
        if(!challengeFound){
            throw new BadRequestException(`Challenge ${challengeId} not found!`)
        }
        const playerFilter = challengeFound.players.filter(player => player._id == assignMatchToChallenge.def)
        if(playerFilter.length == 0){
            throw new BadRequestException(`the winner player not part of the challenge!`)
        }
        const matchCreate = new this.matchModel(assignMatchToChallenge)
        matchCreate.category = challengeFound.category
        matchCreate.players = challengeFound.players
        const match = await matchCreate.save()

        challengeFound.status = ChallengeStatus.COMPLETED
        challengeFound.match = match._id
        try{
            await this.challengeModel.findOneAndUpdate({_id: challengeId}, {$set: challengeFound}).exec()
        
        }catch(error){
            await this.matchModel.deleteOne({_id: match._id}).exec()
            throw new InternalServerErrorException()
        }
    } 
    
    async deleteChallenge(challengeId: string):Promise<void>{
        const challengeFound = await this.challengeModel.findById({challengeId}).exec()
        if(!challengeFound){
            throw new BadRequestException(`Challenge ${challengeId} not found to delete!`)
        }
        challengeFound.status = ChallengeStatus.CANCELED
        await this.challengeModel.findOneAndUpdate({_id: challengeId},{$set: challengeFound}).exec()
    }
}
