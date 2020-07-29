import { Controller, Get, HttpException, HttpStatus, Param } from "@nestjs/common";
import { RoomService } from "./room.service";
import { Room } from "./models/room.model";
import { ApiTags } from "@nestjs/swagger";

@Controller("rooms")
@ApiTags(Room.modelName)
export class RoomController {
   constructor(private readonly _roomService: RoomService) {
   }
   
   @Get()
   // @ApiResponse({ status: HttpStatus.OK, type: MovieVm, isArray: true })
   // @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   // @ApiOperation(GetOperationId(Movie.modelName, "GetAll"))
   async get(): Promise<Room[]> {
      try {
         return await this._roomService.getAllByCinema();
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
   
   @Get(":id")
   async getById(@Param("id") id: string): Promise<Room> {
      try {
         const room = await this._roomService.findById(id);
         return room.toJSON() as Room;
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
}
