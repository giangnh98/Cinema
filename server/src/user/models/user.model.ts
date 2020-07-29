import { BaseModel, schemaOptions } from "../../shared/base.model";
import { UserRole } from "./user-role.enum";
import { ModelType, prop } from "typegoose";

export class User extends BaseModel<User> {
   @prop({
      required: [true, "Email is required"],
      minlength: [6, "Must be at least 6 characters"],
      validate: {
         validator: value => {
            const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return emailRegex.test(value);
         },
         message: "Email is not valid"
      },
      unique: true
   })
   email: string;
   @prop({ required: [true, "Password is required"], minlength: [6, "Must be at least 6 characters"] })
   password: string;
   @prop({ enum: UserRole, default: UserRole.GUEST })
   role?: UserRole;
   @prop() name?: string;
   @prop({
      validate: {
         validator: value => {
            const phoneRegex = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
            return phoneRegex.test(value);
         }
      }
   })
   phone?: string;
   
   static get model(): ModelType<User> {
      return new User().getModelForClass(User, { schemaOptions });
   }
   
   static get modelName(): string {
      return this.model.modelName;
   }
}