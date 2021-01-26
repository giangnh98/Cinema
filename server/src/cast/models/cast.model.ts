import { BaseModel, schemaOptions } from "../../shared/base.model";
import { ModelType, prop, Ref } from "typegoose";
import { Actor } from "src/actor/models/actor.model";
import { Movie } from "src/movie/models/movie.model";

export class Cast extends BaseModel<Cast> {
   @prop({ ref: Actor })
   actor: Ref<Actor>;
   @prop({ ref: Movie })
   movie: Ref<Movie>;
   @prop({ required: [true, "Cast name is required"] })
   castName: string;
   
   static get model(): ModelType<Cast> {
      return new Cast().getModelForClass(Cast, { schemaOptions });
   }
   
   static get modelName(): string {
      return this.model.modelName;
   }
}