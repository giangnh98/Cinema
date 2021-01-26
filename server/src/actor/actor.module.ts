import { Module } from '@nestjs/common';
import { ActorService } from './actor.service';
import { ActorController } from './actor.controller';
import { Actor } from './models/actor.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Actor.modelName, schema: Actor.model.schema }])],
  providers: [ActorService],
  controllers: [ActorController],
  exports: [ActorService]
})
export class ActorModule { }
