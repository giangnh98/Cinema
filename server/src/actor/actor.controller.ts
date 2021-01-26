import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiException } from 'src/shared/api-exception.model';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { CurrentUser } from 'src/shared/decorators/user.decorator';
import { UserRole } from 'src/user/models/user-role.enum';
import { User } from 'src/user/models/user.model';
import { InstanceType } from 'typegoose';
import { ActorService } from './actor.service';
import { Actor } from './models/actor.model';
import { ActorParams } from './view-models/actor-params.model';

@Controller('actors')
@ApiTags(Actor.modelName)
export class ActorController {
    constructor(private readonly _actorService: ActorService) {
    }

    @Post()
    @Auth(UserRole.ADMIN, UserRole.SUPERADMIN)
    @ApiResponse({ status: HttpStatus.CREATED, type: Actor })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    async create(
        @Body() actorParams: ActorParams,
        @CurrentUser() user: InstanceType<User>
    ): Promise<Actor> {
        const fields = Object.keys(actorParams);
        fields.filter(field => {
            if (!actorParams[field]) {
                throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
            }
        });

        const curUser = user.toJSON() as User;
        const cinema = await this._actorService.createActor(actorParams, curUser.id);

        return cinema;
    }
}
