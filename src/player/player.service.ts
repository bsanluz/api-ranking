import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './interface/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayerService {
    constructor(@InjectModel('Player') private readonly playerModel: Model<Player>){}
    async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player>{
        const foundPlayerExists = await this.playerModel.findOne({email: createPlayerDto.email}).exec()
        if (foundPlayerExists){
            throw new BadRequestException(`Player with that ${createPlayerDto.email} email already exists!`)
        }
        const createdPlayer = new this.playerModel(createPlayerDto)
        return await createdPlayer.save()
    }
    async searchPlayerById (_id: string):Promise<Player> {
        const foundPlayer = await this.playerModel.findOne({_id}).exec()
        if (foundPlayer){
            return foundPlayer
        }else {
            throw new NotFoundException(`Player with _id: ${_id} not found`)
        }
    }
    async searchAllPlayers ():Promise<Player[]> {
        return await this.playerModel.find({}).exec()
    }

    async deletePlayer (_id:string):Promise<any>{
        const foundPlayer = await this.playerModel.findOne({_id}).exec()
        if (!foundPlayer){
            throw new NotFoundException(`Player with _id: ${_id} not found to delete`)
        }
        return await  this.playerModel.deleteOne({_id}).exec()
    } 

    async updatePlayer(_id: string ,updatePlayerDto: UpdatePlayerDto):Promise<void>{
          await this.playerModel.findOneAndUpdate({_id},{$set: updatePlayerDto}).exec()
    }
}
