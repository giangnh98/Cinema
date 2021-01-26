import { Body, Controller, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiException } from 'src/shared/api-exception.model';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { CurrentUser } from 'src/shared/decorators/user.decorator';
import { UserRole } from 'src/user/models/user-role.enum';
import { User } from 'src/user/models/user.model';
import { InstanceType } from 'typegoose';
import { CastService } from './cast.service';
import { Cast } from './models/cast.model';
import { CastParams } from './view-models/cast-params.model';

@Controller('casts')
@ApiTags(Cast.modelName)
export class CastController {
    constructor(private readonly _castService: CastService) {
    }

    @Get('relations')
    @ApiResponse({ status: HttpStatus.CREATED, type: Cast, isArray: true })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    async getCastsByMovieId(
        @Query('movieId') movieId: string
    ): Promise<Cast[]> {
        return this._castService.getCastsByMovieId(movieId);
    }

    @Post()
    @Auth(UserRole.ADMIN, UserRole.SUPERADMIN)
    @ApiResponse({ status: HttpStatus.CREATED, type: Cast })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    async create(
        @Body() castParams: CastParams,
        @CurrentUser() user: InstanceType<User>
    ): Promise<Cast> {
        const fields = Object.keys(castParams);
        fields.filter(field => {
            if (!castParams[field]) {
                throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
            }
        });

        const curUser = user.toJSON() as User;
        const cast = await this._castService.createCast(castParams, curUser.id);

        return cast;
    }
}
