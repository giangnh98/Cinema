import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { BaseService } from "../shared/base.service";
import { User } from "./models/user.model";
import { InjectModel } from "@nestjs/mongoose";
import { ModelType } from "typegoose";
import { MapperService } from "../shared/mapper/mapper.service";
import { RegisterVm } from "./view-models/register-vm.model";
import { compare, genSalt, hash } from "bcryptjs";
import { LoginVm } from "./view-models/login-vm.model";
import { LoginResponseVm } from "./view-models/login-response-vm.model";
import { JwtPayload } from "../shared/auth/jwt-payload.model";
import { AuthService } from "../shared/auth/auth.service";
import { UserVm } from "./view-models/user-vm.model";
import { UserParams } from "./view-models/user-params.model";
import { map } from "lodash";
import { UserRole } from "./models/user-role.enum";

@Injectable()
export class UserService extends BaseService<User> {
   constructor(
      @InjectModel(User.modelName)
      private readonly _userModel: ModelType<User>,
      private readonly _mapperService: MapperService,
      @Inject(forwardRef(() => AuthService))
      readonly _authService: AuthService
   ) {
      super(_userModel, _mapperService.mapper);
   }

   async fetchUsers(
      pageSize,
      page,
      sort,
      name,
      email,
      role,
      createdBy,
      updatedBy,
      userId
   ): Promise<UserVm[]> {
      const filters = {};
      filters["isActive"] = true;
      if (name.trim() !== "") filters["name"] = { $regex: ".*" + name.trim().toLowerCase() + ".*", $options: "i" };
      if (email.trim() !== "") filters["email"] = { $regex: ".*" + email.trim().toLowerCase() + ".*", $options: "i" };
      if (role.trim() !== "") filters["role"] = { $regex: ".*" + role.trim().toLowerCase() + ".*", $options: "i" };
      if (createdBy.trim() !== "") filters["createdBy"] = {
         $regex: ".*" + createdBy.trim().toLowerCase() + ".*",
         $options: "i"
      };
      if (updatedBy.trim() !== "") filters["updatedBy"] = {
         $regex: ".*" + updatedBy.trim().toLowerCase() + ".*",
         $options: "i"
      };
      filters["_id"] = { $ne: userId };
      try {
         const users = await this._userModel.find(filters)
            .sort(sort).skip(pageSize * page).limit(parseInt(pageSize)).exec();
         return this.map<UserVm[]>(map(users, user => user.toJSON()));
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   async updateUser(userParams: UserParams, id: string, userId: string): Promise<LoginResponseVm> {
      const { password, name, phone } = userParams;

      try {
         const user = await this._userModel.findOne({ _id: id, isActive: true });

         if (user) {

            user.name = name;
            user.phone = phone;
            user.updated = new Date();
            user.updatedBy = userId;

            if (password) {
               const salt = await genSalt(10);

               user.password = await hash(password, salt);
            }

            const updateUser = await this.update(id, user);

            const payload: JwtPayload = {
               email: updateUser.email,
               role: updateUser.role
            };

            const token = await this._authService.signPayload(payload);
            const userVm: UserVm = await this.map<UserVm>(user.toJSON());

            return {
               token,
               user: userVm
            };
         }

      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   async createUser(registerVm: RegisterVm, userId: string): Promise<User> {
      const { email, password, name, phone } = registerVm;

      const newUser = this.createModel();
      newUser.email = email;
      newUser.name = name;
      newUser.phone = phone;
      newUser.role = UserRole.ADMIN;
      newUser.createdBy = userId;
      newUser.updatedBy = userId;

      const salt = await genSalt(10);
      newUser.password = await hash(password, salt);

      try {
         const result = await this.create(newUser);
         return result.toJSON() as User;
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   async register(registerVm: RegisterVm): Promise<User> {
      const { email, password, name, phone } = registerVm;

      const newUser = this.createModel();
      newUser.email = email;
      newUser.name = name;
      newUser.phone = phone;

      const salt = await genSalt(10);
      newUser.password = await hash(password, salt);

      try {
         const result = await this.create(newUser);
         return result.toJSON() as User;
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   async login(loginVm: LoginVm): Promise<LoginResponseVm> {
      const { email, password } = loginVm;

      const user = await this.findOne({ email, isActive: true });
      if (!user) {
         throw new HttpException("Invalid credentials", HttpStatus.BAD_REQUEST);
      }

      const isMatch = await compare(password, user.password);
      if (!isMatch) {
         throw new HttpException("Invalid credentials", HttpStatus.BAD_REQUEST);
      }

      const payload: JwtPayload = {
         email: email,
         role: user.role
      };

      const token = await this._authService.signPayload(payload);
      const userVm: UserVm = await this.map<UserVm>(user.toJSON());

      return {
         token,
         user: userVm
      };
   }

   async deleteUser(id: string, userId: string): Promise<User> {
      let user;
      try {
         user = await this._userModel.findOne({ _id: id, isActive: true });
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      if (!user) {
         throw new HttpException("User does not exist", HttpStatus.BAD_REQUEST);
      }

      user.isActive = false;
      user.updatedBy = userId;
      user.updated = new Date();
      try {
         const userDelete = await this.update(id, user);

         return userDelete.toJSON() as User;
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
}
