import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Movie } from "./models/movie.model";
import { MovieService } from "./movie.service";
import { MovieVm } from "./view-models/movie-vm.model";
import { ApiException } from "../shared/api-exception.model";
import { GetOperationId } from "../shared/utilities/get-operation-id";
import { map } from "lodash";
import { CurrentUser } from "../shared/decorators/user.decorator";
import { Auth } from "../shared/decorators/auth.decorator";
import { UserRole } from "../user/models/user-role.enum";
import { MovieParams } from "./view-models/movie-params.model";
import { User } from "../user/models/user.model";
import { InstanceType } from "typegoose";

@Controller("movies")
@ApiTags(Movie.modelName)
export class MovieController {
   constructor(private readonly _movieService: MovieService) {
   }

   @Get()
   @ApiResponse({ status: HttpStatus.OK, type: MovieVm, isArray: true })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   @ApiOperation(GetOperationId(Movie.modelName, "GetAll"))
   async get(): Promise<MovieVm[]> {
      try {
         const movies = await this._movieService.find({ isActive: true });
         return this._movieService.map<MovieVm[]>(map(movies, movie => movie.toJSON()), true);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @Get('/relations')
   @ApiResponse({ status: HttpStatus.OK, type: Movie, isArray: true })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   @ApiOperation(GetOperationId(Movie.modelName, "GetMoviesLabel"))
   async getMoviesSameLabel(
      @Query("label") label: string,
      @Query("movieId") movieId: string,
   ): Promise<Movie[]> {
      return this._movieService.getMoviesWithSameLabel(label, movieId);
   }

   @Get("/nowShowing")
   @ApiResponse({ status: HttpStatus.OK, type: MovieVm, isArray: true })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   @ApiOperation(GetOperationId(Movie.modelName, "GetNowShowing"))
   async getNowShowing(): Promise<MovieVm[]> {
      try {
         const movies = await this._movieService.find({
            started: {
               $lte: new Date()
            }, isActive: true
         });
         return this._movieService.map<MovieVm[]>(map(movies, movie => movie.toJSON()), true);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @Get("/comingSoon")
   @ApiResponse({ status: HttpStatus.OK, type: MovieVm, isArray: true })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   @ApiOperation(GetOperationId(Movie.modelName, "GetComingSoon"))
   async getComingSoon(): Promise<MovieVm[]> {
      try {
         const movies = await this._movieService.find({
            started: {
               $gte: new Date()
            }, isActive: true
         });
         return this._movieService.map<MovieVm[]>(map(movies, movie => movie.toJSON()), true);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @Get("/paginate")
   @Auth(UserRole.SUPERADMIN, UserRole.ADMIN)
   @ApiResponse({ status: HttpStatus.OK, type: MovieVm, isArray: true })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   async getWithPaginate(
      @Query("pageSize") pageSize: number,
      @Query("page") page: number,
      @Query("sortBy") sortBy: string,
      @Query("sortType") sortType: string,
      @Query("title") title: string,
      @Query("region") region: string,
      @Query("genre") genre: string,
      @Query("director") director: string,
      @Query("createdBy") createdBy: string,
      @Query("updatedBy") updatedBy: string
   ): Promise<MovieVm[]> {
      const objectSort = {};
      objectSort[sortBy.trim()] = sortType.trim();
      try {
         return this._movieService.findWithPaginate(
            pageSize,
            page,
            objectSort,
            title,
            region,
            genre,
            director,
            createdBy,
            updatedBy
         );
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @Get(":id")
   @ApiResponse({ status: HttpStatus.OK, type: MovieVm })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   @ApiOperation(GetOperationId(Movie.modelName, "GetById"))
   async getById(@Param("id") id: string): Promise<MovieVm> {
      try {
         const movie = await this._movieService.getMovieById(id);
         return this._movieService.map<MovieVm>(movie);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @Post()
   @Auth(UserRole.ADMIN, UserRole.SUPERADMIN)
   @ApiResponse({ status: HttpStatus.CREATED, type: MovieVm })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   @ApiOperation(GetOperationId(Movie.modelName, "Create"))
   async create(@Body() movieParams: MovieParams, @CurrentUser() user: InstanceType<User>): Promise<MovieVm> {
      const fields = Object.keys(movieParams);
      fields.forEach(field => {
         if (!movieParams[field]) {
            throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
         }
      });

      try {
         const curUser = user.toJSON() as User;
         const newMovie = await this._movieService.createMovie(movieParams, curUser.id);
         return this._movieService.map<MovieVm>(newMovie);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

   }

   @Put(":id")
   @Auth(UserRole.ADMIN, UserRole.SUPERADMIN)
   @ApiResponse({ status: HttpStatus.OK, type: MovieVm })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   async update(
      @Param("id") id: string,
      @Body() movieParams: MovieParams,
      @CurrentUser() user: InstanceType<User>
   ): Promise<MovieVm> {
      const fields = Object.keys(movieParams);
      fields.forEach(field => {
         if (!movieParams[field]) {
            throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
         }
      });

      const curUser = user.toJSON() as User;
      const movie = await this._movieService.updateMovie(movieParams, id, curUser.id);

      return this._movieService.map<MovieVm>(movie);
   }

   @Delete(":id")
   @Auth(UserRole.ADMIN, UserRole.SUPERADMIN)
   @ApiResponse({ status: HttpStatus.OK, type: MovieVm })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   async delete(@Param("id") id: string, @CurrentUser() user: InstanceType<User>): Promise<MovieVm> {
      const curUser = user.toJSON() as User;
      const movie = await this._movieService.deleteMovie(id, curUser.id);

      return this._movieService.map<MovieVm>(movie);
   }
}
