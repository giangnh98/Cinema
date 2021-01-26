import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { BaseService } from "../shared/base.service";
import { Prebooking } from "./models/prebooking.model";
import { InjectModel } from "@nestjs/mongoose";
import { ModelType, pre } from "typegoose";
import { MapperService } from "../shared/mapper/mapper.service";
import { map } from "lodash";
import { PrebookingArrayPrams } from "./view-models/prebooking-params.model";
import { ShowtimeService } from "src/showtime/showtime.service";
import { SeatService } from "src/seat/seat.service";
import { User } from "src/user/models/user.model";
import { Seat } from "src/seat/models/seat.model";
import { Showtime } from "src/showtime/models/showtime.model";
import { TicketService } from "src/ticket/ticket.service";

@Injectable()
export class PrebookingService extends BaseService<Prebooking> {
   constructor(
      @InjectModel(Prebooking.modelName)
      private readonly _prebookingModel: ModelType<Prebooking>,
      private readonly _mapperService: MapperService,
      @Inject(forwardRef(() => ShowtimeService))
      private readonly _showtimeService: ShowtimeService,
      private readonly _seatService: SeatService,
      @Inject(forwardRef(() => TicketService))
      private readonly _ticketService: TicketService
   ) {
      super(_prebookingModel, _mapperService.mapper);
   }

   async getSeatsSold(showtimeId: string): Promise<any> {
      let showtime = null;
      try {
         showtime = await this._showtimeService.findOne({ _id: showtimeId, isActive: true });
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      if (!showtime) {
         throw new HttpException("Showtime not exist", HttpStatus.BAD_REQUEST);
      }

      try {
         const prebookings = await this._prebookingModel.find({
            showtime
         }).populate('seat').lean().exec();
         const tickets = await this._ticketService.getTicketsByShow(showtime);
         const solds = prebookings.map(prebooking => prebooking.seat);
         tickets.push(...solds);
         return tickets;
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   async deleteMany(user: User, showtimeId: string): Promise<void> {
      let showtime = null;
      try {
         showtime = await this._showtimeService.findOne({ _id: showtimeId, isActive: true });
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      if (!Showtime) {
         throw new HttpException("Showtime not exist", HttpStatus.BAD_REQUEST);
      }

      try {
         return this.clearCollection({ user: user, showtime });
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   async insertMany(params: PrebookingArrayPrams, user: User): Promise<Prebooking[]> {
      try {
         const items = await Promise.all(
            params.seats.map(async it => {
               let seat, showtime = null;
               try {
                  seat = await this._seatService.findOne({ _id: it.seat, isActive: true });
               } catch (e) {
                  throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
               }

               if (!seat) {
                  throw new HttpException("Seat not exist", HttpStatus.BAD_REQUEST);
               }

               try {
                  showtime = await this._showtimeService.findOne({ _id: it.showtime, isActive: true });
               } catch (e) {
                  throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
               }

               if (!showtime) {
                  throw new HttpException("Showtime not exist", HttpStatus.BAD_REQUEST);
               }
               return this.createModel({
                  seat,
                  showtime,
                  user,
                  createdBy: user.id,
                  updatedBy: user.id
               });
            })
         );
         const results = await this._prebookingModel.insertMany(items);
         return results.map(result => result.toJSON() as Prebooking);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   async findAllWithPaginate(pageSize, page, sort): Promise<Prebooking[]> {
      try {
         const prebooking = await this._prebookingModel.find()
            .sort(sort).skip(pageSize * page).limit(parseInt(pageSize)).exec();
         return map(prebooking, item => item.toJSON() as Prebooking);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
}
