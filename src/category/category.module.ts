import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { categorySchema } from './interface/category.schema';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [MongooseModule.forFeature([{name:'Category', schema: categorySchema}]), PlayerModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports:[CategoryService]
})
export class CategoryModule {}
