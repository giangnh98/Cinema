import { Module } from "@nestjs/common";
import { ShowtimeService } from "./showtime.service";
import { ShowtimeController } from "./showtime.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Showtime } from "./models/showtime.model";
import { MovieModule } from "../movie/movie.module";
import { RoomModule } from "../room/room.module";

@Module({
   imports: [
      MongooseModule.forFeature([{ name: Showtime.modelName, schema: Showtime.model.schema }]),
      MovieModule,
      RoomModule
   ],
   providers: [ShowtimeService],
   controllers: [ShowtimeController],
   exports: [ShowtimeService]
})
export class ShowtimeModule {
}
