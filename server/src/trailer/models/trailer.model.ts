import { BaseModel, schemaOptions } from "../../shared/base.model";
import { ModelType, prop, Ref } from "typegoose";
import { Movie } from "src/movie/models/movie.model";

export class Trailer extends BaseModel<Trailer> {
    @prop({ ref: Movie })
    movie?: Ref<Movie>;
    @prop({ required: [true, "VideoId is required"] })
    videoId: string;

    static get model(): ModelType<Trailer> {
        return new Trailer().getModelForClass(Trailer, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}