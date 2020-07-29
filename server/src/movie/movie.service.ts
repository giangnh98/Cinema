import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { BaseService } from "../shared/base.service";
import { Movie } from "./models/movie.model";
import { InjectModel } from "@nestjs/mongoose";
import { ModelType } from "typegoose";
import { MapperService } from "../shared/mapper/mapper.service";
import { MovieParams } from "./view-models/movie-params.model";
import { MovieVm } from "./view-models/movie-vm.model";
import { map } from "lodash";

@Injectable()
export class MovieService extends BaseService<Movie> {
   constructor(
      @InjectModel(Movie.modelName)
      private readonly _movieModel: ModelType<Movie>,
      private readonly _mapperService: MapperService
   ) {
      super(_movieModel, _mapperService.mapper);
   }
   
   async findWithPaginate(
      pageSize,
      page,
      sort,
      title,
      region,
      genre,
      director,
      createdBy,
      updatedBy
   ): Promise<MovieVm[]> {
      const filters = {};
      filters["isActive"] = true;
      if (title.trim() !== "") filters["title"] = { $regex: ".*" + title.trim().toLowerCase() + ".*", $options: "i" };
      if (region.trim() !== "") filters["region"] = { $regex: ".*" + region.trim().toLowerCase() + ".*", $options: "i" };
      if (genre.trim() !== "") filters["genre"] = { $regex: ".*" + genre.trim().toLowerCase() + ".*", $options: "i" };
      if (director.trim() !== "") filters["director"] = { $regex: ".*" + director.trim().toLowerCase() + ".*", $options: "i" };
      if (createdBy.trim() !== "") filters["createdBy"] = {
         $regex: ".*" + createdBy.trim().toLowerCase() + ".*",
         $options: "i"
      };
      if (updatedBy.trim() !== "") filters["updatedBy"] = {
         $regex: ".*" + updatedBy.trim().toLowerCase() + ".*",
         $options: "i"
      };
      try {
         const movies = await this._movieModel.find(filters)
            .sort(sort).skip(pageSize * page).limit(parseInt(pageSize)).exec();
   
         return this.map<MovieVm[]>(map(movies, movie => movie.toJSON() as Movie));
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
   
   async createMovie(movieParams: MovieParams, id: string): Promise<Movie> {
      const { title, region, description, genre, videoId, image, director, duration, started } = movieParams;
      const updatedBy = id;
      const createdBy = id;
      const newStarted = new Date(started.toString());
      const currentDate = new Date();
      const category = (newStarted > currentDate) ? "0" : "1";
      
      const newMovie = this.createModel();
      newMovie.title = title;
      newMovie.region = region;
      newMovie.description = description;
      newMovie.genre = genre;
      newMovie.started = newStarted;
      newMovie.videoId = videoId;
      newMovie.image = image;
      newMovie.director = director;
      newMovie.duration = duration;
      newMovie.updatedBy = updatedBy;
      newMovie.createdBy = createdBy;
      newMovie.category = category;
      
      try {
         const result = await this.create(newMovie);
         return result.toJSON() as Movie;
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
   
   async updateMovie(movieParams: MovieParams, id: string, userId: string): Promise<Movie> {
      const { description, director, duration, genre, image, region, started, title, videoId } = movieParams;
      
      let movie;
      try {
         movie = await this.findById(id);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      
      if (!movie) {
         throw new HttpException("Movie doesn't exist", HttpStatus.BAD_REQUEST);
      }
   
      const newStarted = new Date(started.toString());
      const currentDate = new Date();
      const category = (newStarted > currentDate) ? "0" : "1";
      
      try {
         movie.description = description;
         movie.director = director;
         movie.duration = duration;
         movie.genre = genre;
         movie.image = image;
         movie.started = newStarted;
         movie.category = category;
         movie.region = region;
         movie.started = started;
         movie.title = title;
         movie.videoId = videoId;
         movie.updatedBy = userId;
         movie.updated = new Date();
         
         const movieUpdate = await this.update(id, movie);
         
         return movieUpdate.toJSON() as Movie;
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
   
   async deleteMovie(id: string, userId: string): Promise<Movie> {
      let movie;
      try {
         movie = this.findById(id);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      
      if (!movie) {
         throw new HttpException("Movie doesn't exist", HttpStatus.BAD_REQUEST);
      }
      
      try {
         movie.isActive = false;
         movie.updatedBy = userId;
         movie.updated = new Date();
         
         const movieDelete = await this.update(id, movie);
         return movieDelete.toJSON() as Movie;
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
}
