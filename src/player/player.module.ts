import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { PlayerSchema } from './interface/player.schema';

@Module({
  imports: [MongooseModule.forFeature([{name:'Player', schema: PlayerSchema}])],
  controllers: [PlayerController],
  providers: [PlayerService],
  exports:[PlayerService]
})
export class PlayerModule {}
