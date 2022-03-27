import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Challenge } from './interface/challenge.interface';
import { ChallengeService } from './challenge.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { ChallengeStatusValidation } from './pipes/challenge-status-validation.pipe';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { AssignMatchToChallengeDto } from './dto/assign-match-challenge.dto';

@Controller('api/v1/challenges')
export class ChallengeController {
    constructor(
       private readonly challengeService: ChallengeService 
    ){}

    @Post()
    @UsePipes(ValidationPipe)
    async createChallenge(createChallengeDto: CreateChallengeDto): Promise<Challenge>{
        return await this.challengeService.createChallenge(createChallengeDto)
    }

    @Post('/:challengeId/match/')
    async assignMatchToChallenge(
        @Body(ValidationPipe) assignMatchToChallenge : AssignMatchToChallengeDto,
        @Param('challengeId') challengeId : string
    ):Promise<void>{
        await this.challengeService.assignMatchToChallenge(challengeId, assignMatchToChallenge)
    }

    @Get()
    async searchChallenges(
        @Query('playerId') playerId: string
    ):Promise<Array<Challenge>>{
        return playerId ? await this.challengeService.searchChallengesOfPlayer(playerId): await this.challengeService.searchAllChallenges()
    }

    @Patch('/:challengeId')
    async updateChallenge(
        @Body(ChallengeStatusValidation) updateChallengeDto: UpdateChallengeDto,
        @Param('challengeId') challengeId: string
    ):Promise<void>{
        await this.challengeService.updateChallenge(challengeId, updateChallengeDto)
    }

    @Delete('/:challengeId')
    async deleteChallenge(
        @Param('challengeId') challengeId : string
    ): Promise<void>{
        await this.challengeService.deleteChallenge(challengeId) 
    }

}
