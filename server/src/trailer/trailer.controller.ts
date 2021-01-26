import { Body, Controller, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiException } from 'src/shared/api-exception.model';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { CurrentUser } from 'src/shared/decorators/user.decorator';
import { UserRole } from 'src/user/models/user-role.enum';
import { User } from 'src/user/models/user.model';
import { InstanceType } from 'typegoose';
import { Trailer } from './models/trailer.model';
import { TrailerService } from './trailer.service';
import { TrailerParams } from './view-models/trailer-params.model';

@Controller('trailers')
@ApiTags(Trailer.modelName)
export class TrailerController {
    constructor(
        private readonly _trailerService: TrailerService,
    ) {
    }

    @Get('/relations')
    @ApiResponse({ status: HttpStatus.OK, type: Trailer, isArray: true })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    async getTrailersForMovie(
        @Query("movieId") movieId: string
    ): Promise<Trailer[]> {
        return this._trailerService.getTrailersForMovie(movieId);
    }

    @Post()
    @Auth(UserRole.ADMIN, UserRole.SUPERADMIN)
    @ApiResponse({ status: HttpStatus.CREATED, type: Trailer })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    async createTrailer(
        @Body() trailerParams: TrailerParams,
        @CurrentUser() user: InstanceType<User>
    ): Promise<Trailer> {
        const fields = Object.keys(trailerParams);
        fields.filter(field => {
            if (!trailerParams[field]) {
                throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
            }
        });

        const curUser = user.toJSON() as User;
        return this._trailerService.postTrailer(trailerParams, curUser.id);
    }
}
