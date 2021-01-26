import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { BaseService } from "../shared/base.service";
import { Ticket } from "./models/ticket.model";
import { InjectModel } from "@nestjs/mongoose";
import { ModelType } from "typegoose";
import { MapperService } from "../shared/mapper/mapper.service";
import { map } from "lodash";
import { User } from "src/user/models/user.model";
import { TicketArrayPrams } from "./view-models/ticket-params.model";
import { PrebookingService } from "src/prebooking/prebooking.service";
import { Seat } from "src/seat/models/seat.model";
import { ShowtimeService } from "src/showtime/showtime.service";

@Injectable()
export class TicketService extends BaseService<Ticket> {
   constructor(
      @InjectModel(Ticket.modelName)
      private readonly _ticketModel: ModelType<Ticket>,
      private readonly _mapperService: MapperService,
      @Inject(forwardRef(() => PrebookingService))
      private readonly _prebookingService: PrebookingService,
      @Inject(forwardRef(() => ShowtimeService))
      private readonly _showtimeService: ShowtimeService
   ) {
      super(_ticketModel, _mapperService.mapper);
   }

   async getTicketsByShow(showtime: string): Promise<any> {
      let exist = null;
      try {
         exist = await this._showtimeService.findOne({ _id: showtime, isActive: true });
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      if (!exist) {
         throw new HttpException("Showtime not exist", HttpStatus.BAD_REQUEST);
      }

      try {
         const tickets = await this._ticketModel.find({
            showtime: exist
         }).populate('seat').lean().exec();

         return tickets.map(ticket => ticket.seat);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   async findAllWithPaginate(pageSize, page, sort): Promise<Ticket[]> {
      try {
         const tickets = await this._ticketModel.find({ isActive: true }).populate("user showtime")
            .sort(sort).skip(pageSize * page).limit(parseInt(pageSize)).exec();
         return map(tickets, ticket => ticket.toJSON() as Ticket);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   async insertMany(ticketParams: TicketArrayPrams, user: User): Promise<Ticket[]> {
      const { seats } = ticketParams;

      try {
         const items = await Promise.all(
            seats.map(async seat => {
               try {
                  const prebooking = await this._prebookingService.findOnePopulate({
                     showtime: seat.showtime,
                     seat: seat.seat,
                     user: user.id
                  }, { path: 'showtime seat' });

                  if (!prebooking) {
                     throw new HttpException("Seat does not booking in room", HttpStatus.BAD_REQUEST);
                  }

                  const isDelete = await this._prebookingService.delete(prebooking.id);
                  if (!isDelete) {
                     throw new HttpException("Seat does not booking in room", HttpStatus.BAD_REQUEST);
                  }

                  const newTicket = this.createModel({
                     showtime: prebooking.showtime,
                     seat: prebooking.seat,
                     user,
                     price: seat.price,
                     type: seat.type,
                     seatNo: seat.seatNo,
                     createdBy: user.id,
                     updatedBy: user.id
                  });

                  const ticket = await this.create(newTicket);

                  return ticket.toJSON() as Ticket;
               } catch (e) {
                  throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
               }
            })
         );

         return items;
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
}
