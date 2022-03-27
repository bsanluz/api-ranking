import { Body, Controller, Post, Get, Delete, Patch, UsePipes, ValidationPipe, Param } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayerService } from './player.service';
import { Player } from './interface/player.interface';
import { paramsValidation } from '../commom/pipes/validation-params.pipe';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Controller('api/v1/player')
export class PlayerController {
    constructor(private readonly playerService:PlayerService){}
    @Post()
    @UsePipes(ValidationPipe)
    async createPlayer(
        @Body() createPlayerDto : CreatePlayerDto): Promise<Player> {
            return await this.playerService.createPlayer(createPlayerDto)
        }

    @Get()
    async searchPlayers(
    ): Promise<Player[]> {
        return this.playerService.searchAllPlayers()
    }
    @Get('/:_id')
    async searchPlayerById(
        @Param('_id', paramsValidation) _id: string
    ): Promise<Player> {
        return this.playerService.searchPlayerById(_id)
    }
    @Delete('/:_id')
    async deletePlayer (
        @Param('_id', paramsValidation) _id: string
    ): Promise<void>{
        await this.playerService.deletePlayer(_id)
    }
    @Patch('/:_id')
    async updatePlayer(
        @Body() updatePlayerDto : UpdatePlayerDto,
        @Param('_id', paramsValidation) _id: string):Promise<void>{
            await this.playerService.updatePlayer(_id, updatePlayerDto)
        }
}
