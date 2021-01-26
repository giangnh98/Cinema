import { BaseModel, schemaOptions } from "../../shared/base.model";
import { index, ModelType, prop, Ref } from "typegoose";
import { Showtime } from "../../showtime/models/showtime.model";
import { Seat } from "src/seat/models/seat.model";
import { User } from "src/user/models/user.model";

@index({ showtime: 1, seat: 1 }, { unique: true })
export class Prebooking extends BaseModel<Prebooking> {
   @prop({ ref: Showtime, required: [true, "showtime is required"] })
   showtime: Ref<Showtime>;
   @prop({ ref: User, required: [true, "user is required"] })
   user: Ref<User>;
   @prop({ ref: Seat, required: [true, "seat is required"] })
   seat: Ref<Seat>;

   static get model(): ModelType<Prebooking> {
      return new Prebooking().getModelForClass(Prebooking, { schemaOptions });
   }

   static get modelName(): string {
      return this.model.modelName;
   }
}