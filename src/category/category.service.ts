import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createCategoryDto } from './dto/create-Category.dto';
import { Category } from './interface/category.interface';
import { Model } from 'mongoose';
import { updateCategoryDto } from './dto/update-Category.dto';
import { PlayerService } from '../player/player.service';
@Injectable()
export class CategoryService {
    constructor(
        @InjectModel('Category') private readonly categoryModel: Model<Category>,
        private readonly playerService : PlayerService
    ){}
    async createCategory(createCategoryDto: createCategoryDto): Promise<Category> {
        const categoryFound = await this.categoryModel.findOne({category: createCategoryDto.category}).exec()
        if (!categoryFound){
            throw new BadRequestException(`Category ${createCategoryDto.category} already exists!`)
        }
        const createCategory = new this.categoryModel(createCategoryDto)
        return  await createCategory.save()
    }

    async searchAllCategories(): Promise<Array<Category>>{
        return await this.categoryModel.find().populate('players').exec()
    }
     
    async searchCategory(category : string): Promise<Category>{
        const categoryFound = await this.categoryModel.findOne({category}).exec()
        if (!categoryFound){
            throw new NotFoundException("Category not found!")
        }
        return categoryFound
    }

    async searchCategoryFromPlayer(playerId: any): Promise<Category>{
        const players = await this.playerService.searchAllPlayers()
        const playerFilter = players.filter(player => player._id== playerId)
        if(playerFilter.length == 0 ){
            throw new BadRequestException(`The Id ${playerId} is not valid player!`)
        }
        return await this.categoryModel.findOne().where('players').in(playerId).exec()
    }

    async updateCategory (updateCategoryDto:updateCategoryDto, category:string): Promise<void>{
        const categoryFound = await this.categoryModel.findOne({category}).exec()
        if (!categoryFound){
            throw new NotFoundException("Category not found to update!")
        }
        await this.categoryModel.findOneAndUpdate({category}, {$set: updateCategoryDto}).exec()
    }

    async assignCategoryToPlayer(routeParams: string[]): Promise<void>{
        const category  = routeParams['category']
        const player  = routeParams['player']
        const categoryFound = await this.categoryModel.findOne({category}).exec()
        
        await this.playerService.searchPlayerById(player)
        
        const playerOnCategory = await this.categoryModel.find({category}).where('players').in(player).exec()
        if (!categoryFound){
            throw new NotFoundException("Category not found!")
        }
        if (playerOnCategory.length > 0){
            throw new BadRequestException(`Player ${player} already assign on category ${category}!`)
        }

        categoryFound.players.push(player)
        await this.categoryModel.findOneAndUpdate({category},{$set: categoryFound}).exec()
    }
}
