import { BaseModel, schemaOptions } from "../../shared/base.model";
import { ModelType, prop, Ref } from "typegoose";
import { User } from "../../user/models/user.model";
import { Showtime } from "../../showtime/models/showtime.model";
import { Seat } from "src/seat/models/seat.model";

export class Ticket extends BaseModel<Ticket> {
   @prop({ ref: Showtime.modelName, required: [true, "showtime is required"] })
   showtime: Ref<Showtime>;
   @prop({ ref: User.modelName, required: [true, 'user is required'] })
   user: Ref<User>;
   @prop({ ref: Seat.modelName, required: [true, 'seat is required'] })
   seat: Ref<Seat>;
   @prop({ required: [true, "type of seat is required"] })
   type: string;
   @prop({ required: [true, "price is required"] })
   price: number;
   @prop({ required: [true, "seat no is required"] })
   seatNo: string;

   static get model(): ModelType<Ticket> {
      return new Ticket().getModelForClass(Ticket, { schemaOptions });
   }

   static get modelName(): string {
      return this.model.modelName;
   }
}