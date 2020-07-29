import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { BaseService } from "../shared/base.service";
import { Showtime } from "./models/showtime.model";
import { InjectModel } from "@nestjs/mongoose";
import { ModelType } from "typegoose";
import { MapperService } from "../shared/mapper/mapper.service";
import { map } from "lodash";

@Injectable()
export class ShowtimeService extends BaseService<Showtime> {
   constructor(
      @InjectModel(Showtime.modelName)
      private readonly _showtimeModel: ModelType<Showtime>,
      private readonly _mapperService: MapperService
   ) {
      super(_showtimeModel, _mapperService.mapper);
   }
   
   async findShowtimesByMovieId(movie: string): Promise<Showtime[]> {
      try {
         const showtimes = await this.findWithPopulate({ movie, isActive: true }, {
            path: "room movie",
            populate: {
               path: "cinema",
               model: "Cinema"
            }
         });
         return map(showtimes, showtime => showtime.toJSON());
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
   
   async findAll(): Promise<Showtime[]> {
      try {
         const showtimes = await this._showtimeModel.find({ isActive: true })
            .populate("movie")
            .populate("room")
            .exec();
         return map(showtimes, showtime => showtime.toJSON());
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
}
