import { Body, Controller, Delete, forwardRef, Get, HttpException, HttpStatus, Inject, Param, Post, Put, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { RoomService } from "./room.service";
import { Room } from "./models/room.model";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { RoomParams } from "./view-models/room-params.model";
import { CinemaService } from "../cinema/cinema.service";
import { Auth } from "../shared/decorators/auth.decorator";
import { UserRole } from "../user/models/user-role.enum";
import { CurrentUser } from "../shared/decorators/user.decorator";
import { InstanceType } from "typegoose";
import { User } from "../user/models/user.model";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { ApiFile } from "src/shared/api-file";
import * as fs from 'fs';

@Controller("rooms")
@ApiTags(Room.modelName)
export class RoomController {
   constructor(
      private readonly _roomService: RoomService,
      @Inject(forwardRef(() => CinemaService))
      private readonly _cinemaService: CinemaService
   ) {
   }

   @Get()
   async get(): Promise<Room[]> {
      try {
         return await this._roomService.getAllByCinema();
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @Get("/paginate")
   @Auth(UserRole.ADMIN, UserRole.SUPERADMIN)
   async getByPaginate(
      @Query("pageSize") pageSize: number,
      @Query("page") page: number,
      @Query("sortBy") sortBy: string,
      @Query("sortType") sortType: string,
   ): Promise<Room[]> {
      try {
         const objectSort = {};
         objectSort[sortBy.trim()] = sortType.trim();
         return this._roomService.findAllWithPaginate(pageSize, page, objectSort);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }


   @Get(":id")
   async getById(@Param("id") id: string): Promise<Room> {
      try {
         const room = await this._roomService.findOne({ _id: id, isActive: true });
         return room.toJSON() as Room;
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @Post()
   @Auth(UserRole.SUPERADMIN, UserRole.ADMIN)
   async create(@Body() roomParams: RoomParams, @CurrentUser() currentUser: InstanceType<User>): Promise<any> {
      const { cinema, name, seats } = roomParams;
      const user = currentUser.toJSON() as User;
      try {
         const cinemaRef = await this._cinemaService.findOne({ _id: cinema, isActive: true });
         const newRoom = this._roomService.createModel();
         newRoom.cinema = cinemaRef._id;
         newRoom.name = name;
         newRoom.seats = seats;
         newRoom.createdBy = user.id;
         newRoom.updatedBy = user.id;

         const room = await this._roomService.create(newRoom);

         return room.toJSON() as Room;
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   // @Post('upload')
   // @ApiConsumes('multipart/form-data')
   // @ApiFile()
   // @UseInterceptors(AnyFilesInterceptor())
   // async uploadFile(@UploadedFiles() files): Promise<any> {
   //    console.log(JSON.parse(fs.readFileSync(files[0].path, 'utf8')));
   // }

   @Put(":id")
   @Auth(UserRole.SUPERADMIN, UserRole.ADMIN)
   async update(
      @Param("id") id: string,
      @Body() roomParams: RoomParams,
      @CurrentUser() currentUser: InstanceType<User>
   ): Promise<Room> {
      const { cinema, name, seats } = roomParams;
      const user = currentUser.toJSON() as User;
      let room;
      try {
         room = await this._roomService.findOne({ _id: id, isActive: true });
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      if (!room) {
         throw new HttpException("Room does not exists.", HttpStatus.BAD_REQUEST);
      }

      try {
         const cinemaRef = await this._cinemaService.findOne({ _id: cinema, isActive: true });
         room.cinema = cinemaRef._id;
         room.name = name;
         room.seats = seats;
         room.updated = new Date();
         room.updatedBy = user.id;

         const updateRoom = await this._roomService.update(id, room);

         return updateRoom.toJSON() as Room;
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @Delete(":id")
   @Auth(UserRole.SUPERADMIN, UserRole.ADMIN)
   async deleteRoom(@Param("id") id: string, @CurrentUser() currentUser: InstanceType<User>): Promise<Room> {
      let room;
      try {
         room = await this._roomService.findOne({ _id: id, isActive: true });
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      if (!room) {
         throw new HttpException("Room does not exists.", HttpStatus.BAD_REQUEST);
      }

      const user = currentUser.toJSON() as User;
      try {
         room.isActive = false;
         room.updated = new Date();
         room.updatedBy = user.id;

         const deleteRoom = await this._roomService.update(id, room);

         return deleteRoom.toJSON() as Room;
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
}
