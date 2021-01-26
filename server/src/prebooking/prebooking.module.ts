import { forwardRef, Module } from "@nestjs/common";
import { PrebookingController } from "./prebooking.controller";
import { PrebookingService } from "./prebooking.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Prebooking } from "./models/prebooking.model";
import { ShowtimeModule } from "../showtime/showtime.module";
import { SeatModule } from "src/seat/seat.module";
import { TicketModule } from "src/ticket/ticket.module";

@Module({
   imports: [
      MongooseModule.forFeature([{ name: Prebooking.modelName, schema: Prebooking.model.schema }]),
      forwardRef(() => ShowtimeModule),
      SeatModule,
      forwardRef(() => TicketModule),
   ],
   controllers: [PrebookingController],
   providers: [PrebookingService],
   exports: [PrebookingService]
})
export class PrebookingModule {
}
