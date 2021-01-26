import { Module } from '@nestjs/common';
import { CastService } from './cast.service';
import { CastController } from './cast.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cast } from './models/cast.model';
import { ActorModule } from 'src/actor/actor.module';
import { MovieModule } from 'src/movie/movie.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cast.modelName, schema: Cast.model.schema }]),
    ActorModule,
    MovieModule
  ],
  providers: [CastService],
  controllers: [CastController],
  exports: [CastService]
})
export class CastModule {}
