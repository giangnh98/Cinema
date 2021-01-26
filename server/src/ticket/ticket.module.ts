import { forwardRef, Module } from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { TicketController } from "./ticket.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Ticket } from "./models/ticket.model";
import { ShowtimeModule } from "../showtime/showtime.module";
import { PrebookingModule } from "../prebooking/prebooking.module";

@Module({
   imports: [
      MongooseModule.forFeature([{ name: Ticket.modelName, schema: Ticket.model.schema }]),
      forwardRef(() => PrebookingModule),
      forwardRef(() => ShowtimeModule),
   ],
   providers: [TicketService],
   controllers: [TicketController],
   exports: [TicketService]
})
export class TicketModule {
}
