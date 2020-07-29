import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { BaseService } from "../shared/base.service";
import { Ticket } from "./models/ticket.model";
import { InjectModel } from "@nestjs/mongoose";
import { ModelType } from "typegoose";
import { MapperService } from "../shared/mapper/mapper.service";
import { map } from "lodash";

@Injectable()
export class TicketService extends BaseService<Ticket> {
   constructor(
      @InjectModel(Ticket.modelName)
      private readonly _ticketModel: ModelType<Ticket>,
      private readonly _mapperService: MapperService
   ) {
      super(_ticketModel, _mapperService.mapper);
   }
   
   async findAllWithPaginate(pageSize, page, sort): Promise<Ticket[]> {
      try {
         const tickets = await this._ticketModel.find().populate("user")
            .sort(sort).skip(pageSize * page).limit(parseInt(pageSize)).exec();
         return map(tickets, ticket => ticket.toJSON() as Ticket);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
}
