import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { Auth } from "../shared/decorators/auth.decorator";
import { UserRole } from "../user/models/user-role.enum";
import { TicketParams } from "./view-models/ticket-params.model";
import { Ticket } from "./models/ticket.model";
import { CurrentUser } from "../shared/decorators/user.decorator";
import { InstanceType } from "typegoose";
import { User } from "../user/models/user.model";
import { ShowtimeService } from "../showtime/showtime.service";
import { map } from "lodash";
import { PrebookingService } from "../prebooking/prebooking.service";
import { ApiTags } from "@nestjs/swagger";

@Controller("tickets")
@ApiTags(Ticket.modelName)
export class TicketController {
   constructor(
      private readonly _ticketService: TicketService,
      private readonly _showtimeService: ShowtimeService,
      private readonly _prebookingService: PrebookingService
   ) {
   }
   
   @Get()
   async get(): Promise<Ticket[]> {
      try {
         const tickets = await this._ticketService.findWithPopulate({ isActive: true },
            {
               path: "showtime",
               populate: {
                  path: "room",
                  model: "Room"
               }
            });
         return map(tickets, ticket => ticket.toJSON() as Ticket);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
   
   @Get("/paginate")
   @Auth(UserRole.SUPERADMIN, UserRole.ADMIN)
   async getWithPaginate(
      @Query("pageSize") pageSize: number,
      @Query("page") page: number,
      @Query("sortBy") sortBy: string,
      @Query("sortType") sortType: string,
   ): Promise<Ticket[]> {
      try {
         const objectSort = {};
         objectSort[sortBy.trim()] = sortType.trim();
         return this._ticketService.findAllWithPaginate(pageSize, page, objectSort);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
   
   @Get("user")
   @Auth(UserRole.GUEST, UserRole.ADMIN, UserRole.SUPERADMIN)
   async getTicketsUser(@CurrentUser() currentUser: InstanceType<User>): Promise<Ticket[]> {
      try {
         const user = currentUser.toJSON() as User;
         const tickets = await this._ticketService.findWithPopulateAndSort({ isActive: true, user: user.id },
            {
               path: "showtime",
               populate: [
                  {
                     path: "room",
                     populate: {
                        path: "cinema",
                        model: "Cinema"
                     }
                  },
                  { path: "movie", model: "Movie" }
               ]
            }, { created: "descending" });
         return map(tickets, ticket => ticket.toJSON() as Ticket);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
   
   @Get(":showtime")
   async getByShowtime(@Param("showtime") showtime: string): Promise<Ticket[]> {
      try {
         const tickets = await this._ticketService.findWithPopulate({ isActive: true, showtime },
            {
               path: "showtime",
               populate: {
                  path: "room",
                  model: "Room"
               }
            });
         return map(tickets, ticket => ticket.toJSON() as Ticket);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
   
   @Post()
   @Auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.GUEST)
   async create(
      @Body() ticketParams: TicketParams,
      @CurrentUser() currentUser: InstanceType<User>
   ): Promise<Ticket[]> {
      const fields = Object.keys(ticketParams);
      fields.forEach(field => {
         if (!ticketParams[field]) {
            throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
         }
      });
      const { seats, showtime, price, type } = ticketParams;
      const user = currentUser.toJSON() as User;
      
      try {
         let tickets = [];
         const showtimeRef = await this._showtimeService.findById(showtime);
         for (let i = 0; i < seats.length; ++i) {
            const newTicket = this._ticketService.createModel();
            newTicket.showtime = showtimeRef._id;
            newTicket.user = user;
            newTicket.price = price[i];
            newTicket.type = type[i];
            newTicket.seats = seats[i];
            newTicket.created = new Date();
            newTicket.updated = new Date();
            newTicket.createdBy = user.id;
            newTicket.updatedBy = user.id;
            const ticket = await this._ticketService.create(newTicket);
            tickets.push(ticket);
         }
         await this._prebookingService.clearCollection({ user: user.id });
         return map(tickets, pre => pre.toJSON() as Ticket);
         
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
}
