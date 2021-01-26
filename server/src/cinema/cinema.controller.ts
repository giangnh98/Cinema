import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { CinemaService } from "./cinema.service";
import { CinemaVm } from "./view-models/cinema-vm.model";
import { map } from "lodash";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { ApiException } from "../shared/api-exception.model";
import { Cinema } from "./models/cinema.model";
import { CinemaParams } from "./view-models/cinema-params.model";
import { Auth } from "../shared/decorators/auth.decorator";
import { UserRole } from "../user/models/user-role.enum";
import { CurrentUser } from "../shared/decorators/user.decorator";
import { InstanceType } from "typegoose";
import { User } from "../user/models/user.model";

@Controller("cinemas")
@ApiTags(Cinema.modelName)
export class CinemaController {
   constructor(private readonly _cinemaService: CinemaService) {
   }

   @Get()
   @ApiResponse({ status: HttpStatus.OK, type: CinemaVm, isArray: true })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   async get(@Query("released") released: string, @Query("movie") movie: string): Promise<any> {
      return this._cinemaService.getCinemas(released, movie);
   }

   @Get('/all')
   @ApiResponse({ status: HttpStatus.OK, type: CinemaVm, isArray: true })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   async getAll(): Promise<CinemaVm[]> {
      return this._cinemaService.getAll();
   }

   @Get("/paginate")
   @Auth(UserRole.SUPERADMIN, UserRole.ADMIN)
   @ApiResponse({ status: HttpStatus.OK, type: CinemaVm, isArray: true })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   async getWithPaginate(
      @Query("pageSize") pageSize: number,
      @Query("page") page: number,
      @Query("sortBy") sortBy: string,
      @Query("sortType") sortType: string,
      @Query("name") name: string,
      @Query("address") address: string,
      @Query("city") city: string,
      @Query("createdBy") createdBy: string,
      @Query("updatedBy") updatedBy: string
   ): Promise<CinemaVm[]> {
      const objectSort = {};
      objectSort[sortBy.trim()] = sortType.trim();
      try {
         return this._cinemaService.fetchCinemas(
            pageSize,
            page,
            objectSort,
            name,
            address,
            city,
            createdBy,
            updatedBy
         );
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @Get(":id")
   @ApiResponse({ status: HttpStatus.OK, type: CinemaVm })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   async getCinemaById(@Param("id") id: string): Promise<CinemaVm> {
      let cinema;
      try {
         cinema = await this._cinemaService.findOne({ _id: id, isActive: true });
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      if (!cinema) {
         throw new HttpException("Cinema does not exist", HttpStatus.BAD_REQUEST);
      }

      return this._cinemaService.map<CinemaVm>(cinema.toJSON());
   }

   @Post()
   @Auth(UserRole.ADMIN, UserRole.SUPERADMIN)
   @ApiResponse({ status: HttpStatus.CREATED, type: CinemaVm })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   async create(@Body() cinemaParams: CinemaParams, @CurrentUser() user: InstanceType<User>): Promise<CinemaVm> {
      const fields = Object.keys(cinemaParams);
      fields.filter(field => {
         if (!cinemaParams[field]) {
            throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
         }
      });

      const curUser = user.toJSON() as User;
      const cinema = await this._cinemaService.createCinema(cinemaParams, curUser.id);

      return this._cinemaService.map<CinemaVm>(cinema);
   }

   @Put(":id")
   @Auth(UserRole.ADMIN, UserRole.SUPERADMIN)
   @ApiResponse({ status: HttpStatus.OK, type: CinemaVm })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   async updateCinema(
      @Param("id") id: string,
      @Body() cinemaParams: CinemaParams,
      @CurrentUser() user: InstanceType<User>
   ): Promise<CinemaVm> {
      const fields = Object.keys(cinemaParams);
      fields.filter(field => {
         if (!cinemaParams[field]) {
            throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
         }
      });

      const curUser = user.toJSON() as User;
      const cinema = await this._cinemaService.updateCinema(cinemaParams, id, curUser.id);

      return this._cinemaService.map<CinemaVm>(cinema);
   }

   @Delete(":id")
   @Auth(UserRole.ADMIN, UserRole.SUPERADMIN)
   @ApiResponse({ status: HttpStatus.OK, type: CinemaVm })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   async delete(@Param("id") id: string, @CurrentUser() user: InstanceType<User>): Promise<CinemaVm> {
      const curUser = user.toJSON() as User;
      const cinema = await this._cinemaService.deleteCinema(id, curUser.id);

      return this._cinemaService.map<CinemaVm>(cinema);
   }
}
