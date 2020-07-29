import { BaseModel, schemaOptions } from "../../shared/base.model";
import { ModelType, prop, Ref } from "typegoose";
import { User } from "../../user/models/user.model";
import { Showtime } from "../../showtime/models/showtime.model";

export class Ticket extends BaseModel<Ticket> {
   @prop({ ref: Showtime.modelName })
   showtime?: Ref<Showtime>;
   @prop({ ref: User.modelName })
   user?: Ref<User>;
   @prop({ required: [true, "seats is required"] })
   seats: Array<number>;
   @prop({ required: [true, "type of seat is required"] })
   type: string;
   @prop({ required: [true, "price is required"] })
   price: number;
   
   static get model(): ModelType<Ticket> {
      return new Ticket().getModelForClass(Ticket, { schemaOptions });
   }
   
   static get modelName(): string {
      return this.model.modelName;
   }
}