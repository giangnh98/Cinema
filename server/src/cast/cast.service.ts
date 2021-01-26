import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ActorService } from 'src/actor/actor.service';
import { Actor } from 'src/actor/models/actor.model';
import { Movie } from 'src/movie/models/movie.model';
import { MovieService } from 'src/movie/movie.service';
import { BaseService } from 'src/shared/base.service';
import { MapperService } from 'src/shared/mapper/mapper.service';
import { ModelType } from 'typegoose';
import { Cast } from './models/cast.model';
import { CastParams } from './view-models/cast-params.model';

@Injectable()
export class CastService extends BaseService<Cast> {
    constructor(
        @InjectModel(Cast.modelName)
        private readonly _castModel: ModelType<Cast>,
        private readonly _mapperService: MapperService,
        private readonly _actorService: ActorService,
        private readonly _movieService: MovieService
    ) {
        super(_castModel, _mapperService.mapper);
    }

    async getCastsByMovieId(movieId: string): Promise<Cast[]> {
        let exists: Movie = null;

        try {
            exists = await this._movieService.getMovieById(movieId);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (!exists) {
            throw new HttpException("Movie does not exists", HttpStatus.BAD_REQUEST);
        }

        try {
            const casts = await this._castModel.find({ movie: exists, isActive: true }).populate('actor');
            const results = casts.filter(cast => {
                const { actor } = cast;
                return (actor as Actor).isActive === true;
            });
            return results;
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createCast(castParams: CastParams, userId: string): Promise<Cast> {
        const { actor, castName, movie } = castParams;
        let existActor: Actor = null, existMovie: Movie = null;
        try {
            existActor = await this._actorService.getActorById(actor);
            existMovie = await this._movieService.getMovieById(movie);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (!existMovie) {
            throw new HttpException("Movie does not exists", HttpStatus.BAD_REQUEST);
        }

        if (!existActor) {
            throw new HttpException("Actor does not exists", HttpStatus.BAD_REQUEST);
        }

        try {
            const newCast = this.createModel({
                movie: existMovie,
                actor: existActor,
                castName,
                createdBy: userId,
                updatedBy: userId
            });
            const cast = await this.create(newCast);

            return cast.toJSON() as Cast;
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
