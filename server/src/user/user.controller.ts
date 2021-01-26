import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./models/user.model";
import { UserService } from "./user.service";
import { ApiException } from "../shared/api-exception.model";
import { GetOperationId } from "../shared/utilities/get-operation-id";
import { RegisterVm } from "./view-models/register-vm.model";
import { UserVm } from "./view-models/user-vm.model";
import { LoginResponseVm } from "./view-models/login-response-vm.model";
import { LoginVm } from "./view-models/login-vm.model";
import { Auth } from "../shared/decorators/auth.decorator";
import { UserRole } from "./models/user-role.enum";
import { CurrentUser } from "../shared/decorators/user.decorator";
import { InstanceType } from "typegoose";
import { UserParams } from "./view-models/user-params.model";
import { map } from "lodash";

@Controller("users")
@ApiTags(User.modelName)
export class UserController {
   constructor(private readonly _userService: UserService) {
   }

   @Get()
   @Auth(UserRole.SUPERADMIN)
   @ApiResponse({ status: HttpStatus.OK, type: UserVm, isArray: true })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   async get(
      @Query("pageSize") pageSize: number,
      @Query("page") page: number,
      @Query("sortBy") sortBy: string,
      @Query("sortType") sortType: string,
      @Query("name") name: string,
      @Query("email") email: string,
      @Query("role") role: string,
      @Query("createdBy") createdBy: string,
      @Query("updatedBy") updatedBy: string,
      @CurrentUser() currentUser: InstanceType<User>
   ): Promise<UserVm[]> {
      const objectSort = {};
      const user = currentUser.toJSON() as User;
      objectSort[sortBy.trim()] = sortType.trim();
      try {
         return this._userService.fetchUsers(
            pageSize,
            page,
            objectSort,
            name,
            email,
            role,
            createdBy,
            updatedBy,
            user.id
         );
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @Get("/all")
   @Auth(UserRole.SUPERADMIN)
   @ApiResponse({ status: HttpStatus.OK, type: UserVm, isArray: true })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   async getAll(): Promise<UserVm[]> {
      try {
         const users = await this._userService.find();
         return this._userService.map<UserVm[]>(map(users, user => user.toJSON() as User));
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @Get("auth")
   @Auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.GUEST)
   @ApiResponse({ status: HttpStatus.OK, type: UserVm })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   @ApiOperation(GetOperationId(User.modelName, "Authentication"))
   async auth(@CurrentUser() user: InstanceType<User>): Promise<UserVm> {
      if (!user) {
         throw new HttpException("You do not have permission to access this resource", HttpStatus.UNAUTHORIZED);
      }

      return this._userService.map<UserVm>(user.toJSON());
   }

   @Get(":id")
   @Auth(UserRole.SUPERADMIN, UserRole.ADMIN)
   @ApiResponse({ status: HttpStatus.OK, type: UserVm })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   async getUserById(@Param("id") id: string): Promise<UserVm> {
      let user;

      try {
         user = await this._userService.findOne({ _id: id, isActive: true });
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      if (!user) {
         throw new HttpException("User does not exist", HttpStatus.BAD_REQUEST);
      }

      return this._userService.map<UserVm>(user.toJSON());
   }

   @Get("/size/:pageSize")
   @Auth(UserRole.SUPERADMIN, UserRole.ADMIN)
   @ApiResponse({ status: HttpStatus.OK, type: Number })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   async getCount(@Param("pageSize") pageSize: number): Promise<number> {
      try {
         const users = await this._userService.find({ isActive: true });
         return Math.ceil(users.length / pageSize);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }


   @Post()
   @Auth(UserRole.SUPERADMIN)
   @ApiResponse({ status: HttpStatus.CREATED, type: UserVm })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   async create(@Body() registerVm: RegisterVm, @CurrentUser() user: InstanceType<User>): Promise<UserVm> {
      const fields = Object.keys(registerVm);
      fields.filter(field => {
         if (!registerVm[field]) {
            throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
         }
      });
      const curUser = user.toJSON() as User;
      const newUser = await this._userService.createUser(registerVm, curUser.id);

      return this._userService.map<UserVm>(newUser);
   }

   @Post("register")
   @ApiResponse({ status: HttpStatus.CREATED, type: UserVm })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   @ApiOperation(GetOperationId(User.modelName, "Register"))
   async register(@Body() registerVm: RegisterVm): Promise<UserVm> {
      const { email, password } = registerVm;

      if (!email) {
         throw new HttpException("Username is required", HttpStatus.BAD_REQUEST);
      }

      if (!password) {
         throw new HttpException("Password is required", HttpStatus.BAD_REQUEST);
      }

      let exist;
      try {
         exist = await this._userService.findOne({ email });
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      if (exist) {
         throw new HttpException(`${email} exists`, HttpStatus.BAD_REQUEST);
      }

      const newUser = await this._userService.register(registerVm);
      return this._userService.map<UserVm>(newUser);
   }

   @Post("login")
   @ApiResponse({ status: HttpStatus.CREATED, type: LoginResponseVm })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   @ApiOperation(GetOperationId(User.modelName, "Login"))
   async login(@Body() loginVm: LoginVm): Promise<LoginResponseVm> {
      const fields = Object.keys(loginVm);
      fields.filter(field => {
         if (!loginVm[field]) {
            throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
         }
      });

      return this._userService.login(loginVm);
   }

   @Put(":id")
   @Auth(UserRole.GUEST, UserRole.SUPERADMIN)
   @ApiResponse({ status: HttpStatus.OK, type: LoginResponseVm })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   async updateUser(
      @Param("id") id: string,
      @Body() userParams: UserParams,
      @CurrentUser() user: InstanceType<User>
   ): Promise<LoginResponseVm> {
      const fields = Object.keys(userParams).filter(key => key !== "password");
      fields.forEach(field => {
         if (!userParams[field]) {
            throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
         }
      });

      const curUser = user.toJSON() as User;
      return this._userService.updateUser(userParams, id, curUser.id);
   }

   @Delete(":id")
   @Auth(UserRole.SUPERADMIN)
   @ApiResponse({ status: HttpStatus.OK, type: UserVm })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
   async delete(@Param("id") id: string, @CurrentUser() user: InstanceType<User>): Promise<UserVm> {
      const curUser = user.toJSON() as User;
      const userDelete = await this._userService.deleteUser(id, curUser.id);

      return this._userService.map<UserVm>(userDelete);
   }
}
