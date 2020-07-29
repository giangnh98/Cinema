import { LoginVm } from "./login-vm.model";
import { ApiModelPropertyOptional } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class RegisterVm extends LoginVm {
   @ApiModelPropertyOptional()
   name?: string;
   @ApiModelPropertyOptional()
   phone?: string;
}