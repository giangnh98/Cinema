import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { BaseService } from "../shared/base.service";
import { Cinema } from "./models/cinema.model";
import { InjectModel } from "@nestjs/mongoose";
import { ModelType } from "typegoose";
import { MapperService } from "../shared/mapper/mapper.service";
import { CinemaParams } from "./view-models/cinema-params.model";
import { map } from "lodash";
import { CinemaVm } from "./view-models/cinema-vm.model";

@Injectable()
export class CinemaService extends BaseService<Cinema> {
   constructor(
      @InjectModel(Cinema.modelName)
      public readonly _cinemaModel: ModelType<Cinema>,
      private readonly _mapperService: MapperService
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
         cinema = await this.findById(id);
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
         cinema = await this.findById(id);
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
