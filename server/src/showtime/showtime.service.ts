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

   async getShowById(showId: string): Promise<Showtime> {
      try {
         const showtime = await this._showtimeModel.findOne({ _id: showId, isActive: true }).populate({
            path: "room movie",
            populate: {
               path: "cinema",
               model: "Cinema"
            }
         });
         return showtime.toJSON() as Showtime;
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   async getShowtimesByDate(movie: string): Promise<any> {
      try {
         const showtimes = await this.find({ movie, isActive: true });
         const items = showtimes.map(showtime => (showtime.toJSON() as Showtime).released.toString());
         return items.filter(function (item, pos) {
            return items.indexOf(item) == pos;
         });
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   async findShowtimesByMovieId(movie: string): Promise<any> {
      try {
         const groupBy = (xs, key) => {
            return xs.reduce((rv, x) => {
               (rv[x[key]] = rv[x[key]] || []).push(x);
               return rv;
            }, {});
         };
         const showtimes = await this.findWithPopulate({ movie, isActive: true }, {
            path: "room movie",
            populate: {
               path: "cinema",
               model: "Cinema"
            }
         });
         let results = showtimes.map(showtime => {
            const room: any = showtime.room;
            return {
               ...Showtime,
               room: {},
               cinema: room.cinema
            };
         });
         results = groupBy(showtimes, 'room.cinema.name');
         return results;
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
