import { BaseModel, schemaOptions } from "../../shared/base.model";
import { ModelType, prop, Ref } from "typegoose";
import { Cinema } from "../../cinema/models/cinema.model";

export class Room extends BaseModel<Room> {
   @prop({ ref: Cinema })
   cinema?: Ref<Cinema>;
   @prop({ required: [true, "Room name is required"] })
   name: string;
   @prop({ required: [true, "Total seat is required"] })
   seats: number;
   
   static get model(): ModelType<Room> {
      return new Room().getModelForClass(Room, { schemaOptions });
   }
   
   static get modelName(): string {
      return this.model.modelName;
   }
}