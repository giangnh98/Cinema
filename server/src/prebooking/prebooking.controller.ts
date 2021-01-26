import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { PrebookingService } from "./prebooking.service";
import { Auth } from "../shared/decorators/auth.decorator";
import { UserRole } from "../user/models/user-role.enum";
import { PrebookingArrayPrams, PrebookingParams } from "./view-models/prebooking-params.model";
import { User } from "../user/models/user.model";
import { CurrentUser } from "../shared/decorators/user.decorator";
import { InstanceType } from "typegoose";
import { map } from "lodash";
import { Prebooking } from "./models/prebooking.model";
import { ApiTags } from "@nestjs/swagger";
import { Seat } from "src/seat/models/seat.model";

@Controller("prebooking")
@ApiTags(Prebooking.modelName)
export class PrebookingController {
   constructor(
      private readonly _prebookingService: PrebookingService,
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
   ): Promise<any> {
      return this._prebookingService.getSeatsSold(showtime);
   }

   @Post()
   @Auth(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.GUEST)
   async create(
      @Body() prebookingParams: PrebookingArrayPrams,
      @CurrentUser() currentUser: InstanceType<User>
   ): Promise<Prebooking[]> {
      const fields = Object.keys(prebookingParams);
      fields.forEach(field => {
         if (!prebookingParams[field]) {
            throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
         }
      });
      const curUser = currentUser.toJSON() as User;
      return await this._prebookingService.insertMany(prebookingParams, curUser);
   }

   @Delete('/showtime/:id')
   @Auth(UserRole.ADMIN, UserRole.GUEST, UserRole.SUPERADMIN)
   async deleteAll(
      @Param('id') id: string,
      @CurrentUser() currentUser: InstanceType<User>
   ): Promise<void> {
      
      try {
         const user = currentUser.toJSON() as User;
         return this._prebookingService.deleteMany(user, id);
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
