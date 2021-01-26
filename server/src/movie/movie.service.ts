import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { BaseService } from "../shared/base.service";
import { Movie } from "./models/movie.model";
import { InjectModel } from "@nestjs/mongoose";
import { InstanceType, ModelType } from "typegoose";
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

   async getMoviesWithSameLabel(label: string, movieId: string): Promise<Movie[]> {
      try {
         const movies = await this.find({
            label, isActive: true, _id: {
               $ne: movieId
            }
         });
         return movies.map(movie => movie.toJSON() as Movie);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   async getMovieById(movieId: string): Promise<Movie> {
      let exists: InstanceType<Movie> = null;
      try {
         exists = await this._movieModel.findOne({ _id: movieId, isActive: true });
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      if (!exists) {
         throw new HttpException("Movie does not exists", HttpStatus.BAD_REQUEST);
      }

      return exists.toJSON() as Movie;
   }

   async createMovie(movieParams: MovieParams, id: string): Promise<Movie> {
      const {
         title,
         region,
         description,
         genre,
         image,
         director,
         duration,
         started,
         poster,
         label,
         language
      } = movieParams;
      const updatedBy = id;
      const createdBy = id;
      const newStarted = new Date(started.toString());

      const newMovie = this.createModel();
      newMovie.title = title;
      newMovie.region = region;
      newMovie.description = description;
      newMovie.genre = genre;
      newMovie.started = newStarted;
      newMovie.image = image;
      newMovie.director = director;
      newMovie.duration = duration;
      newMovie.updatedBy = updatedBy;
      newMovie.createdBy = createdBy;
      newMovie.poster = poster;
      newMovie.label = label;
      newMovie.language = language;

      try {
         const result = await this.create(newMovie);
         return result.toJSON() as Movie;
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   async updateMovie(movieParams: MovieParams, id: string, userId: string): Promise<Movie> {
      const {
         description,
         director,
         duration,
         genre,
         image,
         region,
         started,
         title,
         label,
         language,
         poster
      } = movieParams;

      let movie;
      try {
         movie = await this.getMovieById(id);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      if (!movie) {
         throw new HttpException("Movie doesn't exist", HttpStatus.BAD_REQUEST);
      }

      const newStarted = new Date(started.toString());

      try {
         movie.label = label;
         movie.language = language;
         movie.poster = poster;
         movie.description = description;
         movie.director = director;
         movie.duration = duration;
         movie.genre = genre;
         movie.image = image;
         movie.started = newStarted;
         movie.region = region;
         movie.started = started;
         movie.title = title;
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
         movie = await this.getMovieById(id);
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
