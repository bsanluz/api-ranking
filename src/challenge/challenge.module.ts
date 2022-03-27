import { Module } from '@nestjs/common';
import { ChallengeController } from './challenge.controller';
import { ChallengeService } from './challenge.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeSchema } from './interface/challenge.schema';
import { MatchSchema } from './interface/match.schema';
import { PlayerModule } from '../player/player.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports:[MongooseModule.forFeature([
    {name: 'Challenge', schema: ChallengeSchema},
    {name: 'Match', schema: MatchSchema},
  ]),
  PlayerModule,
  CategoryModule
],
  controllers: [ChallengeController],
  providers: [ChallengeService]
})
export class ChallengeModule {}
