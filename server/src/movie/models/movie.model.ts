import { BaseModel, schemaOptions } from "../../shared/base.model";
import { ModelType, prop, Ref } from "typegoose";

export class Movie extends BaseModel<Movie> {
   @prop({ required: [true, "Title is required"] })
   title: string;
   @prop({ required: [true, "Region is required"] })
   region: string;
   @prop({ required: [true, "Description is required"] })
   description: string;
   @prop({ required: [true, "Duration is required"] })
   duration: string;
   @prop({ required: [true, "Genre is required"] })
   genre: string;
   @prop({ required: [true, "Image is required"] })
   image: string;
   @prop({ required: [true, "Director is required"] })
   director: string;
   @prop({ required: [true, "Label is required"] })
   label: string;
   @prop({ required: [true, "Poster is required"] })
   poster: string;
   @prop({ required: [true, "Language is required"] })
   language: string;
   @prop()
   started?: Date;
   
   static get model(): ModelType<Movie> {
      return new Movie().getModelForClass(Movie, { schemaOptions });
   }
   
   static get modelName(): string {
      return this.model.modelName;
   }
}