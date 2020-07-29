import { ApiModelPropertyOptional } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class UserParams {
   @ApiModelPropertyOptional()
   name?: string;
   @ApiModelPropertyOptional()
   password?: string;
   @ApiModelPropertyOptional()
   phone?: string;
}