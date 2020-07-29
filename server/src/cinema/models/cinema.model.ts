import { BaseModel, schemaOptions } from "../../shared/base.model";
import { arrayProp, ModelType, prop, Ref } from "typegoose";

export class Cinema extends BaseModel<Cinema> {
   @prop({ required: [true, "Name must be required"] })
   name: string;
   @prop({ required: [true, "Address must be required"] })
   address: string;
   @prop()
   star?: number;
   @prop({ required: [true, "City must be required"] })
   city: string;
   @prop({ required: [true, "Image must be required"] })
   image: string;
   
   static get model(): ModelType<Cinema> {
      return new Cinema().getModelForClass(Cinema, { schemaOptions });
   }
   
   static get modelName(): string {
      return this.model.modelName;
   }
}