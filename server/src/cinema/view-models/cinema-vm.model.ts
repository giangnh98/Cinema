import { BaseModelVm } from "../../shared/base.model";
import { ApiModelPropertyOptional } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class CinemaVm extends BaseModelVm {
   @ApiModelPropertyOptional() name: string;
   @ApiModelPropertyOptional() address: string;
   @ApiModelPropertyOptional() star?: number;
   @ApiModelPropertyOptional() city: string;
   @ApiModelPropertyOptional() image: string;
}