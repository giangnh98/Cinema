import { BaseModel, schemaOptions } from "../../shared/base.model";
import { arrayProp, ModelType, prop, Ref } from "typegoose";

export class Actor extends BaseModel<Actor> {
    @prop({ required: [true, "Name must be required"] })
    name: string;
    @prop({ required: [true, "Image must be required"] })
    image: string;

    static get model(): ModelType<Actor> {
        return new Actor().getModelForClass(Actor, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}