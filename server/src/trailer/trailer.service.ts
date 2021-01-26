import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from 'src/movie/models/movie.model';
import { MovieService } from 'src/movie/movie.service';
import { BaseService } from 'src/shared/base.service';
import { MapperService } from 'src/shared/mapper/mapper.service';
import { ModelType } from 'typegoose';
import { Trailer } from './models/trailer.model';
import { TrailerParams } from './view-models/trailer-params.model';

@Injectable()
export class TrailerService extends BaseService<Trailer> {
    constructor(
        @InjectModel(Trailer.modelName)
        private readonly _trailerModel: ModelType<Trailer>,
        private readonly _mapperService: MapperService,
        private readonly _movieService: MovieService
    ) {
        super(_trailerModel, _mapperService.mapper);
    }

    async getTrailersForMovie(movieId: string): Promise<Trailer[]> {
        let movieExists: Movie = null;
        try {
            movieExists = await this._movieService.getMovieById(movieId);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (!movieExists) {
            throw new HttpException("Movie doesn't exists", HttpStatus.BAD_REQUEST);
        }

        try {
            const trailers = await this.find({ movie: movieExists, isActive: true });
            return trailers.map(trailer => trailer.toJSON() as Trailer);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async postTrailer(trailerParams: TrailerParams, userId: string): Promise<Trailer> {
        let movieExists: Movie = null;
        try {
            movieExists = await this._movieService.getMovieById(trailerParams.movie);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (!movieExists) {
            throw new HttpException("Movie doesn't exists", HttpStatus.BAD_REQUEST);
        }

        try {
            const newTrailer = this.createModel({
                movie: movieExists,
                videoId: trailerParams.videoId,
                createdBy: userId,
                updatedBy: userId
            });
            const trailer = await this.create(newTrailer);
            return trailer.toJSON() as Trailer;
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
