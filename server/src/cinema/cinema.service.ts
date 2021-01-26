import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { BaseService } from "../shared/base.service";
import { Cinema } from "./models/cinema.model";
import { InjectModel } from "@nestjs/mongoose";
import { ModelType } from "typegoose";
import { MapperService } from "../shared/mapper/mapper.service";
import { CinemaParams } from "./view-models/cinema-params.model";
import { map, isEmpty } from "lodash";
import { CinemaVm } from "./view-models/cinema-vm.model";
import { Room } from "src/room/models/room.model";
import { RoomService } from "src/room/room.service";
import { ShowtimeService } from "src/showtime/showtime.service";

@Injectable()
export class CinemaService extends BaseService<Cinema> {
   constructor(
      @InjectModel(Cinema.modelName)
      public readonly _cinemaModel: ModelType<Cinema>,
      private readonly _mapperService: MapperService,
      @Inject(forwardRef(() => RoomService))
      private readonly _roomService: RoomService,
      private readonly _showtimeService: ShowtimeService
   ) {
      super(_cinemaModel, _mapperService.mapper);
   }

   async fetchCinemas(
      pageSize,
      page,
      sort,
      name,
      address,
      city,
      createdBy,
      updatedBy
   ): Promise<CinemaVm[]> {
      const filters = {};
      filters["isActive"] = true;
      if (name.trim() !== "") filters["name"] = { $regex: ".*" + name.trim().toLowerCase() + ".*", $options: "i" };
      if (address.trim() !== "") filters["address"] = { $regex: ".*" + address.trim().toLowerCase() + ".*", $options: "i" };
      if (city.trim() !== "") filters["city"] = { $regex: ".*" + city.trim().toLowerCase() + ".*", $options: "i" };
      if (createdBy.trim() !== "") filters["createdBy"] = {
         $regex: ".*" + createdBy.trim().toLowerCase() + ".*",
         $options: "i"
      };
      if (updatedBy.trim() !== "") filters["updatedBy"] = {
         $regex: ".*" + updatedBy.trim().toLowerCase() + ".*",
         $options: "i"
      };
      try {
         const cinemas = await this._cinemaModel.find(filters)
            .sort(sort).skip(pageSize * page).limit(parseInt(pageSize)).exec();
         return this.map<CinemaVm[]>(map(cinemas, cinema => cinema.toJSON()));
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   async getAll(): Promise<CinemaVm[]> {
      try {
         const cinemas = await this.find({ isActive: true });
         return this.map<CinemaVm[]>(map(cinemas, cinema => cinema.toJSON() as Cinema));
      } catch(e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   async getCinemas(released: string, movie: string): Promise<any> {
      try {
         const groupBy = (xs, key) => {
            return xs.reduce((rv, x) => {
               (rv[x[key]] = rv[x[key]] || []).push(x);
               return rv;
            }, {});
         };
         const cinemas = await this._cinemaModel.find({
            isActive: true
         }).lean().exec();
         const results = await Promise.all(
            cinemas.map(async cinema => {
               const rooms = await this._roomService.find({ cinema, isActive: true });
               const shows = await Promise.all(
                  rooms.map(async room => {
                     const items = await this._showtimeService.findWithPopulate({
                        released,
                        movie,
                        room,
                        isActive: true
                     }, { path: 'room' });
                     return items;
                  })
               );

               let items = [];
               shows.map(show => show.map(it => items.push(it)));

               return {
                  ...cinema,
                  shows: items
               };
            })
         );
         const kq = results.filter(it => !isEmpty(it.shows));
         const data = groupBy(kq, 'city');
         Object.keys(data).forEach(it => {
            data[it] = groupBy(data[it], 'name');
         });
         return data;
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   async createCinema(cinemaParams: CinemaParams, userId: string): Promise<Cinema> {
      const { name, address, city, image, star } = cinemaParams;

      try {
         const newCinema = this.createModel();
         newCinema.name = name;
         newCinema.address = address;
         newCinema.city = city;
         newCinema.image = image;
         newCinema.star = star;
         newCinema.createdBy = userId;
         newCinema.updatedBy = userId;

         const cinema = await this.create(newCinema);

         return cinema.toJSON() as Cinema;
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   async updateCinema(cinemaParams: CinemaParams, id: string, userId: string): Promise<Cinema> {
      const { name, address, city, image, star } = cinemaParams;
      let cinema;

      try {
         cinema = await this._cinemaModel.findOne({ _id: id, isActive: true });
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      if (!cinema) {
         throw new HttpException("Cinema does not exist", HttpStatus.BAD_REQUEST);
      }

      try {
         cinema.name = name;
         cinema.address = address;
         cinema.city = city;
         cinema.image = image;
         cinema.star = star;
         cinema.updatedBy = userId;
         cinema.updated = new Date();

         const updateCinema = await this.update(id, cinema);

         return updateCinema.toJSON() as Cinema;
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   async deleteCinema(id: string, userId: string): Promise<Cinema> {
      let cinema;
      try {
         cinema = await this._cinemaModel.findOne({ _id: id, isActive: true });
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      if (!cinema) {
         throw new HttpException("Cinema does not exist", HttpStatus.BAD_REQUEST);
      }

      try {
         cinema.isActive = false;
         cinema.updatedBy = userId;
         cinema.updated = new Date();

         const cinemaDelete = await this.update(id, cinema);

         return cinemaDelete.toJSON() as Cinema;
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
}
