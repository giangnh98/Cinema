import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from 'src/room/models/room.model';
import { RoomService } from 'src/room/room.service';
import { BaseService } from 'src/shared/base.service';
import { MapperService } from 'src/shared/mapper/mapper.service';
import { InstanceType, ModelType } from 'typegoose';
import { Seat } from './models/seat.model';
import { SeatArrayParams } from './view-models/seat-params.model';

@Injectable()
export class SeatService extends BaseService<Seat> {
    constructor(
        @InjectModel(Seat.modelName)
        private readonly _seatModel: ModelType<Seat>,
        private readonly _mapperService: MapperService,
        private readonly _roomService: RoomService
    ) {
        super(_seatModel, _mapperService.mapper);
    }

    async getSeatsByRoomId(roomId: string): Promise<any> {
        let exists: InstanceType<Room> = null;
        try {
            exists = await this._roomService.findOne({ _id: roomId, isActive: true });
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (!exists) {
            throw new HttpException("Room not exists", HttpStatus.BAD_REQUEST);
        }

        try {
            const seats = await this._seatModel.find({ room: exists.toJSON() as Room, isActive: true });
            return seats.map(seat => {
                const it = seat.toJSON() as Seat;
                return {
                    ...it,
                    seatState: it.seatType === 2 ? 2 : 0
                };
            });
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createSeats(seatArrayParams: SeatArrayParams, userId: string): Promise<Seat[]> {
        const { room, seats } = seatArrayParams;
        let exists: InstanceType<Room> = null;
        try {
            exists = await this._roomService.findOne({ _id: room, isActive: true });
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (!exists) {
            throw new HttpException("Room not exists", HttpStatus.BAD_REQUEST);
        }

        try {
            const newSeats = seats.map(seat => this.createModel({
                ...seat,
                createdBy: userId,
                updatedBy: userId,
                room: exists.toJSON() as Room
            }));
            const s = await this._seatModel.insertMany(newSeats);
            return s.map(item => item.toJSON() as Seat);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
