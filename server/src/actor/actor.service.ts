import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from 'src/shared/base.service';
import { MapperService } from 'src/shared/mapper/mapper.service';
import { ModelType } from 'typegoose';
import { Actor } from './models/actor.model';
import { ActorParams } from './view-models/actor-params.model';

@Injectable()
export class ActorService extends BaseService<Actor> {
    constructor(
        @InjectModel(Actor.modelName)
        public readonly _actorModel: ModelType<Actor>,
        private readonly _mapperService: MapperService
    ) {
        super(_actorModel, _mapperService.mapper);
    }

    async getActorById(actorId: string): Promise<Actor> {
        let exists: Actor = null;
        try {
            exists = await this._actorModel.findOne({ _id: actorId, isActive: true });
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (!exists) {
            throw new HttpException("Actor does not exists", HttpStatus.BAD_REQUEST);
        }

        return exists;
    }

    async createActor(actorParams: ActorParams, userId: string): Promise<Actor> {
        const { image, name } = actorParams;
        let exists = {};
        try {
            exists = await this.findOne({ name, isActive: true });
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (exists) {
            throw new HttpException("Actor already exists", HttpStatus.BAD_REQUEST);
        }

        try {
            const newActor = this.createModel({
                name,
                image,
                createdBy: userId,
                updatedBy: userId
            });
            const actor = await this.create(newActor);
            return actor.toJSON() as Actor;
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
