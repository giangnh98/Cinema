import { Body, Controller, Delete, forwardRef, Get, HttpException, HttpStatus, Inject, Param, Post, Put, Query } from "@nestjs/common";
import { ShowtimeService } from "./showtime.service";
import { Showtime } from "./models/showtime.model";
import { ShowtimeParams } from "./view-models/showtime-params.model";
import { CurrentUser } from "../shared/decorators/user.decorator";
import { InstanceType } from "typegoose";
import { User } from "../user/models/user.model";
import { Auth } from "../shared/decorators/auth.decorator";
import { UserRole } from "../user/models/user-role.enum";
import { MovieService } from "../movie/movie.service";
import { RoomService } from "../room/room.service";
import { ApiTags } from "@nestjs/swagger";
import { TicketService } from "src/ticket/ticket.service";

@Controller("showtimes")
@ApiTags(Showtime.modelName)
export class ShowtimeController {
   constructor(
      private readonly _showtimeService: ShowtimeService,
      private readonly _movieService: MovieService,
      private readonly _roomService: RoomService,
      @Inject(forwardRef(() => TicketService))
      private readonly _ticketService: TicketService
   ) {
   }

   @Get()
   async get(): Promise<Showtime[]> {
      try {
         return this._showtimeService.findAll();
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @Get('date')
   async getByDate(@Query('movieId') movieId: string): Promise<any> {
      try {
         return this._showtimeService.getShowtimesByDate(movieId);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @Get(":id")
   async getById(@Param("id") id: string): Promise<Showtime> {
      try {
         return this._showtimeService.getShowById(id);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @Get("/movie/:id")
   // @ApiResponse({ status: HttpStatus.OK, type: MovieVm, isArray: true })
   // @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   // @ApiOperation(GetOperationId(Movie.modelName, "GetAll"))
   async getByMovieId(@Param("id") id: string): Promise<any> {
      try {
         return await this._showtimeService.findShowtimesByMovieId(id);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @Post()
   @Auth(UserRole.ADMIN, UserRole.SUPERADMIN)
   async create(@Body() showtimeParams: ShowtimeParams, @CurrentUser() user: InstanceType<User>): Promise<Showtime> {
      const fields = Object.keys(showtimeParams);
      fields.forEach(field => {
         if (!showtimeParams[field]) {
            throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
         }
      });

      const { movie, released, room, seatPrice, time } = showtimeParams;

      let exists = {};
      try {
         exists = await this._showtimeService.findOne({ room, released, time, isActive: true });
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      if (exists) {
         throw new HttpException("Showtime not valid", HttpStatus.BAD_REQUEST);
      }

      const curUser = user.toJSON() as User;
      try {
         const newShowtime = this._showtimeService.createModel();
         const movieRef = await this._movieService.findOne({ _id: movie, isActive: true });
         const roomRef = await this._roomService.findOne({ _id: room, isActive: true });
         newShowtime.movie = movieRef._id;
         newShowtime.room = roomRef._id;
         newShowtime.released = new Date(released);
         newShowtime.seatPrice = seatPrice;
         newShowtime.time = time;
         newShowtime.createdBy = curUser.id;
         newShowtime.updatedBy = curUser.id;

         const showtime = await this._showtimeService.create(newShowtime);

         return showtime.toJSON() as Showtime;

      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

   }

   @Put(":id")
   @Auth(UserRole.ADMIN, UserRole.SUPERADMIN)
   async update(
      @Param("id") id: string,
      @Body() showtimeParams: ShowtimeParams,
      @CurrentUser() user: InstanceType<User>
   ): Promise<Showtime> {
      const fields = Object.keys(showtimeParams);
      fields.forEach(field => {
         if (!showtimeParams[field]) {
            throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
         }
      });

      const { movie, released, room, seatPrice, time } = showtimeParams;

      const curUser = user.toJSON() as User;
      try {
         const newShowtime = await this._showtimeService.findOne({ _id: id, isActive: true });
         const movieRef = await this._movieService.findOne({ _id: movie, isActive: true });
         const roomRef = await this._roomService.findOne({ _id: room, isActive: true });
         newShowtime.movie = movieRef._id;
         newShowtime.room = roomRef._id;
         newShowtime.released = new Date(released);
         newShowtime.seatPrice = seatPrice;
         newShowtime.time = time;
         newShowtime.updated = new Date();
         newShowtime.updatedBy = curUser.id;

         const showtime = await this._showtimeService.update(id, newShowtime);

         return showtime.toJSON() as Showtime;

      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

   }

   @Delete(":id")
   @Auth(UserRole.ADMIN, UserRole.SUPERADMIN)
   async delete(@Param("id") id: string, @CurrentUser() user: InstanceType<User>): Promise<Showtime> {
      let ticket = [], showtime = null;
      try {
         showtime = await this._showtimeService.findOne({ _id: id, isActive: true });
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      if (!showtime) {
         throw new HttpException("Not Found", HttpStatus.BAD_REQUEST);
      }

      try {
         ticket = await this._ticketService.find({ showtime: showtime.toJSON() as Showtime, isActive: true });
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      if (ticket.length > 0) {
         throw new HttpException("Showtime schedules that have already been booked cannot be deleted", HttpStatus.BAD_REQUEST);
      }

      const showtimeDelete = await this._showtimeService.delete(id);
      return showtimeDelete.toJSON() as Showtime;
   }

}
