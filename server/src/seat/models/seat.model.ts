import { BaseModel, schemaOptions } from "../../shared/base.model";
import { ModelType, prop, Ref } from "typegoose";
import { SeatType } from "./seat-type.model";
import { Room } from "src/room/models/room.model";

export class Seat extends BaseModel<Seat> {
   @prop({ required: [true, "seat row is required"] })
   seatRow: string;
   @prop({ required: [true, "seat column is required"] })
   seatCol: string;
   @prop({ default: 0 })
   seatType?: number;
   @prop({ required: [true, "graph row is required"] })
   graphRow: number;
   @prop({ required: [true, "graph column is required"] })
   graphCol: number;
   @prop({ default: false })
   isLoverL?: boolean;
   @prop({ ref: Room })
   room?: Ref<Room>;

   static get model(): ModelType<Seat> {
      return new Seat().getModelForClass(Seat, { schemaOptions });
   }

   static get modelName(): string {
      return this.model.modelName;
   }
}