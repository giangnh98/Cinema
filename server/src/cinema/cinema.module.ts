import { forwardRef, Module } from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { CinemaController } from './cinema.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Cinema } from "./models/cinema.model";
import { RoomModule } from 'src/room/room.module';
import { ShowtimeModule } from 'src/showtime/showtime.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Cinema.modelName, schema: Cinema.model.schema}]),
    forwardRef(() => RoomModule),
    ShowtimeModule
  ],
  providers: [CinemaService],
  controllers: [CinemaController],
  exports: [CinemaService]
})
export class CinemaModule {}
