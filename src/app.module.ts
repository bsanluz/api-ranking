import { Module } from '@nestjs/common';
import { PlayerModule } from './player/player.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from './category/category.module';
import { ChallengeModule } from './challenge/challenge.module';

@Module({
  imports: [ PlayerModule, 
  MongooseModule.forRoot('mongodb+srv://admin:jlCri7zFfKKZEjs4@clusterapi.md6x8.mongodb.net/smartRanking?retryWrites=true&w=majority'), CategoryModule, ChallengeModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
