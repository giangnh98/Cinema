import { Module } from '@nestjs/common';
import { TrailerService } from './trailer.service';
import { TrailerController } from './trailer.controller';
import { MovieModule } from 'src/movie/movie.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Trailer } from './models/trailer.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Trailer.modelName, schema: Trailer.model.schema }]),
    MovieModule
  ],
  providers: [TrailerService],
  controllers: [TrailerController],
  exports: [TrailerService]
})
export class TrailerModule {}
