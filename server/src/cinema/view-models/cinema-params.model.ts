import { ApiModelPropertyOptional } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class CinemaParams {
   @ApiModelPropertyOptional() name: string;
   @ApiModelPropertyOptional() address: string;
   @ApiModelPropertyOptional() star?: number;
   @ApiModelPropertyOptional() city: string;
   @ApiModelPropertyOptional() image: string;
}