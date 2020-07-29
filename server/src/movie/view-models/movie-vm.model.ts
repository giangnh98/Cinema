import { BaseModelVm } from "../../shared/base.model";
import { ApiModelPropertyOptional } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class MovieVm extends BaseModelVm {
   @ApiModelPropertyOptional() title: string;
   @ApiModelPropertyOptional() region: string;
   @ApiModelPropertyOptional() description: string;
   @ApiModelPropertyOptional() duration: string;
   @ApiModelPropertyOptional() genre: string;
   @ApiModelPropertyOptional() videoId: string;
   @ApiModelPropertyOptional() image: string;
   @ApiModelPropertyOptional() director: string;
   @ApiModelPropertyOptional({ type: String, format: "date-time" }) started?: Date;
   @ApiModelPropertyOptional() category: string;
}