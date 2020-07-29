import { Module } from "@nestjs/common";
import { RoomController } from "./room.controller";
import { RoomService } from "./room.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Room } from "./models/room.model";

@Module({
   imports: [MongooseModule.forFeature([{ name: Room.modelName, schema: Room.model.schema }])],
   controllers: [RoomController],
   providers: [RoomService],
   exports: [RoomService]
})
export class RoomModule {
}
