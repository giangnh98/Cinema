import { BaseModel, schemaOptions } from "../../shared/base.model";
import { ModelType, prop, Ref } from "typegoose";
import { Showtime } from "../../showtime/models/showtime.model";

export class Prebooking extends BaseModel<Prebooking> {
   @prop({ ref: Showtime })
   showtime?: Ref<Showtime>;
   @prop({required: [true, "User is required"]})
   user: string;
   @prop({required: [true, "Seats is required"]})
   seats: Array<number>;
   
   static get model(): ModelType<Prebooking> {
      return new Prebooking().getModelForClass(Prebooking, { schemaOptions });
   }
   
   static get modelName(): string {
      return this.model.modelName;
   }
}