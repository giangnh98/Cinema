import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { PrebookingService } from "./prebooking.service";
import { Auth } from "../shared/decorators/auth.decorator";
import { UserRole } from "../user/models/user-role.enum";
import { PrebookingParams } from "./view-models/prebooking-params.model";
import { User } from "../user/models/user.model";
import { CurrentUser } from "../shared/decorators/user.decorator";
import { InstanceType } from "typegoose";
import { ShowtimeService } from "../showtime/showtime.service";
import { map } from "lodash";
import { Prebooking } from "./models/prebooking.model";
import { ApiTags } from "@nestjs/swagger";

@Controller("prebooking")
@ApiTags(Prebooking.modelName)
export class PrebookingController {
   constructor(
      private readonly _prebookingService: PrebookingService,
      private readonly _showtimeService: ShowtimeService
   ) {
   }
   
   @Get()
   async getAll(): Promise<Prebooking[]> {
      try {
         const prebooking = await this._prebookingService.find();
         return map(prebooking, item => item.toJSON() as Prebooking);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
   
   @Get("/paginate")
   @Auth(UserRole.ADMIN, UserRole.SUPERADMIN)
   async getWithPaginate(
      @Query("pageSize") pageSize: number,
      @Query("page") page: number,
      @Query("sortBy") sortBy: string,
      @Query("sortType") sortType: string,
   ): Promise<Prebooking[]> {
      try {
         const objectSort = {};
         objectSort[sortBy.trim()] = sortType.trim();
         return this._prebookingService.findAllWithPaginate(pageSize, page, objectSort);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
   
   @Get(":showtime")
   async get(
      @Param("showtime") showtime: string
   ): Promise<Prebooking[]> {
      try {
         const prebookings = await this._prebookingService.find({
            showtime
         });
         return map(prebookings, prebooking => prebooking.toJSON() as Prebooking);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
   
   @Post()
   @Auth(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.GUEST)
   async create(
      @Body() prebookingParams: PrebookingParams,
      @CurrentUser() currentUser: InstanceType<User>
   ): Promise<Prebooking[]> {
      const fields = Object.keys(prebookingParams);
      fields.forEach(field => {
         if (!prebookingParams[field]) {
            throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
         }
      });
      const curUser = currentUser.toJSON() as User;
      const { seats, showtime } = prebookingParams;
      let exists = [];
      try {
         const items = await this._prebookingService.find({ showtime });
         for (const seat of seats) {
            let exist = items.find(item => JSON.stringify(item.seats) === JSON.stringify(seat));
            if (exist) {
               exists.push(exist);
            }
         }
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      
      if (exists.length > 0) {
         exists.forEach(exist => {
            const { seats } = exist;
            const row = String.fromCharCode(97 + seats[0]).toUpperCase();
            const col = seats[1];
            throw new HttpException(`Seat ${row}${col} has been Reserved`, HttpStatus.BAD_REQUEST);
         });
      }
      
      try {
         let prebookings = [];
         const showtimeRef = await this._showtimeService.findById(showtime);
         for (const seat of seats) {
            const newPrebooking = this._prebookingService.createModel();
            newPrebooking.showtime = showtimeRef._id;
            newPrebooking.user = curUser.id;
            newPrebooking.createdBy = curUser.id;
            newPrebooking.updatedBy = curUser.id;
            newPrebooking.seats = seat;
            const prebooking = await this._prebookingService.create(newPrebooking);
            prebookings.push(prebooking);
         }
         return map(prebookings, pre => pre.toJSON() as Prebooking);
         
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
   
   @Delete()
   @Auth(UserRole.ADMIN, UserRole.GUEST, UserRole.SUPERADMIN)
   async deleteAll(@CurrentUser() currentUser: InstanceType<User>): Promise<void> {
      try {
         const user = currentUser.toJSON() as User;
         return this._prebookingService.clearCollection({ user: user.id });
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
   
   @Delete(":id")
   @Auth(UserRole.ADMIN, UserRole.SUPERADMIN)
   async deleteOne(@Param("id") id: string): Promise<Prebooking> {
      try {
         const prebooking = await this._prebookingService.delete(id);
         return prebooking.toJSON() as Prebooking;
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
}
