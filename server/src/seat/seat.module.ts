import { Module } from '@nestjs/common';
import { SeatService } from './seat.service';
import { SeatController } from './seat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Seat } from './models/seat.model';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Seat.modelName, schema: Seat.model.schema }]),
    RoomModule
  ],
  providers: [SeatService],
  controllers: [SeatController],
  exports: [SeatService]
})
export class SeatModule { }
