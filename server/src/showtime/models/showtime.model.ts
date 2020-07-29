import { BaseModel, schemaOptions } from "../../shared/base.model";
import { Movie } from "../../movie/models/movie.model";
import { ModelType, prop, Ref } from "typegoose";
import { Room } from "../../room/models/room.model";
import { ISeatPrice } from "./showtime-type.model";

export class Showtime extends BaseModel<Showtime> {
   @prop({ ref: Movie.modelName })
   movie?: Ref<Movie>;
   @prop({ ref: Room.modelName })
   room?: Ref<Room>;
   @prop({ required: [true, "Released is required"] })
   released: Date;
   @prop({ required: [true, "Time is required"] })
   time: string;
   @prop({ required: [true, "seat price is required"] })
   seatPrice: ISeatPrice;
   
   static get model(): ModelType<Showtime> {
      return new Showtime().getModelForClass(Showtime, { schemaOptions });
   }
   
   static get modelName(): string {
      return this.model.modelName;
   }
}