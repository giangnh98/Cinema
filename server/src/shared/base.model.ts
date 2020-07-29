import { SchemaOptions } from "mongoose";
import { ApiModelPropertyOptional } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { Typegoose, prop, pre } from "typegoose";

// @ts-ignore
@pre<T>("findOneAndUpdate", function(next) {
   this._update.updated = new Date(Date.now());
   next();
})
export abstract class BaseModel<T> extends Typegoose {
   @prop({ default: true })
   isActive?: boolean;
   
   @prop({ default: Date.now() })
   created?: Date;
   
   @prop({ default: Date.now() })
   updated?: Date;
   
   @prop({ default: null }) createdBy?: string;
   
   @prop({ default: null }) updatedBy?: string;
   
   id?: string;
}

export abstract class BaseModelVm {
   @ApiModelPropertyOptional()
   isActive?: boolean;
   
   @ApiModelPropertyOptional({ type: String, format: "date-time" })
   created?: Date;
   
   @ApiModelPropertyOptional({ type: String, format: "date-time" })
   updated?: Date;
   
   @ApiModelPropertyOptional() createdBy?: string;
   
   @ApiModelPropertyOptional() updatedBy?: string;
   
   @ApiModelPropertyOptional() id?: string;
}

export const schemaOptions: SchemaOptions = {
   toJSON: {
      virtuals: true,
      getters: true
   }
};