import { BaseModel, schemaOptions } from "../../shared/base.model";
import { ModelType, prop, Ref } from "typegoose";
import { Cinema } from "../../cinema/models/cinema.model";
import { RoomType } from "./room-type.enum";

export class Room extends BaseModel<Room> {
   @prop({ ref: Cinema })
   cinema?: Ref<Cinema>;
   @prop({ required: [true, "Room name is required"] })
   name: string;
   @prop({ enum: RoomType, default: RoomType.TYPE2D })
   roomType?: RoomType;
   @prop({ required: [true, "Total seat is required"] })
   seats: number;
   @prop({ required: [true, "Structure room is required"] })
   structure: Array<Array<number>>;
   
   static get model(): ModelType<Room> {
      return new Room().getModelForClass(Room, { schemaOptions });
   }
   
   static get modelName(): string {
      return this.model.modelName;
   }
}