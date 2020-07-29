import { Module } from "@nestjs/common";
import { MovieController } from "./movie.controller";
import { MovieService } from "./movie.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Movie } from "./models/movie.model";

@Module({
   imports: [MongooseModule.forFeature([{ name: Movie.modelName, schema: Movie.model.schema }])],
   controllers: [MovieController],
   providers: [MovieService],
   exports: [MovieService]
})
export class MovieModule {
}
