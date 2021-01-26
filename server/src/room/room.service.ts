import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { BaseService } from "../shared/base.service";
import { Room } from "./models/room.model";
import { InjectModel } from "@nestjs/mongoose";
import { ModelType } from "typegoose";
import { MapperService } from "../shared/mapper/mapper.service";
import { map } from "lodash";
import { Prebooking } from "../prebooking/models/prebooking.model";

@Injectable()
export class RoomService extends BaseService<Room> {
   constructor(
      @InjectModel(Room.modelName)
      private readonly _roomModel: ModelType<Room>,
      private readonly _mapperService: MapperService
   ) {
      super(_roomModel, _mapperService.mapper);
   }

   async findAllWithPaginate(pageSize, page, sort): Promise<Room[]> {
      try {
         const rooms = await this._roomModel.find({ isActive: true })
            .sort(sort).skip(pageSize * page).limit(parseInt(pageSize)).exec();
         return map(rooms, item => item.toJSON() as Room);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   async getAllByCinema(cinema?: string): Promise<Room[]> {
      try {
         const rooms = await this._roomModel.find({ isActive: true }).populate("cinema").exec();
         return map(rooms, room => room.toJSON());
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
}
