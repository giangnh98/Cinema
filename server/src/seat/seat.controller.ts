import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiException } from 'src/shared/api-exception.model';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { CurrentUser } from 'src/shared/decorators/user.decorator';
import { UserRole } from 'src/user/models/user-role.enum';
import { User } from 'src/user/models/user.model';
import { InstanceType } from 'typegoose';
import { Seat } from './models/seat.model';
import { SeatService } from './seat.service';
import { SeatArrayParams } from './view-models/seat-params.model';

@Controller('seats')
@ApiTags(Seat.modelName)
export class SeatController {
    constructor(private readonly _seatService: SeatService) {
    }

    @Get('/relations')
    @ApiResponse({ status: HttpStatus.OK, type: Seat, isArray: true })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    async getSeatsByRoomId(
        @Query("roomId") roomId: string,
    ): Promise<any> {
        return this._seatService.getSeatsByRoomId(roomId);
    }

    @Post()
    @Auth(UserRole.ADMIN, UserRole.SUPERADMIN)
    @ApiResponse({ status: HttpStatus.CREATED, type: Seat, isArray: true })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    async create(
        @Body() seatArrayParams: SeatArrayParams,
        @CurrentUser() user: InstanceType<User>
    ): Promise<Seat[]> {
        const fields = Object.keys(seatArrayParams);
        fields.forEach(field => {
            if (!seatArrayParams[field]) {
                throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
            }
        });

        try {
            const curUser = user.toJSON() as User;
            const seats = await this._seatService.createSeats(seatArrayParams, curUser.id);
            return seats;
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Delete(':id')
    @Auth(UserRole.ADMIN, UserRole.SUPERADMIN)
    async clearCollections(@Param("id") id: string): Promise<void> {
        try {
            await this._seatService.clearCollection({ room: id });
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
