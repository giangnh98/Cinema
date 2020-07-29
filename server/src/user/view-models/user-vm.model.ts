import { BaseModelVm } from "../../shared/base.model";
import { UserRole } from "../models/user-role.enum";
import { ApiModelPropertyOptional } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { EnumToArray } from "../../shared/utilities/enum-to-array";

export class UserVm extends BaseModelVm {
   @ApiModelPropertyOptional() email: string;
   @ApiModelPropertyOptional() name?: string;
   @ApiModelPropertyOptional({ enum: EnumToArray(UserRole) }) role?: UserRole;
   @ApiModelPropertyOptional() phone?: string;
   @ApiModelPropertyOptional() ref?: string;
}