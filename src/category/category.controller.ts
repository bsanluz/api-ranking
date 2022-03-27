import { Body, Controller, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { createCategoryDto } from './dto/create-Category.dto';
import { Category } from './interface/category.interface';
import { CategoryService } from './category.service';
import { updateCategoryDto } from './dto/update-Category.dto';
import { paramsValidation } from 'src/commom/pipes/validation-params.pipe';

@Controller('api/v1/category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService){
    }
    @Post()
    @UsePipes(ValidationPipe)
    async createCategory(
        @Body() createCategoryDto: createCategoryDto): Promise<Category> {
            return await this.categoryService.createCategory(createCategoryDto)
        }
    @Get()
    async searchAllCategories(): Promise<Array<Category>> {
        return await this.categoryService.searchAllCategories()
    }
    @Get('/:category')
    async searchCategoryById(
        @Param('category') category : string
    ): Promise<Category>{
        return await this.categoryService.searchCategory(category)
    }
    @Patch('/:category')
    async updateCategory(
        @Body() updateCategoryDto: updateCategoryDto,
        @Param('category', paramsValidation) category: string
    ): Promise<void>{
        return await this.categoryService.updateCategory(updateCategoryDto, category)
    }
    @Post('/:category/players/:player')
    async assignCategoryToPlayer(
        @Param() routeParams: string[]
    ): Promise<void>{
        return await this.categoryService.assignCategoryToPlayer(routeParams)
    }
}
