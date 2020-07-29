import { ApiModelPropertyOptional } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class TicketParams {
   @ApiModelPropertyOptional()
   showtime: string;
   @ApiModelPropertyOptional()
   seats: Array<Array<number>>;
   @ApiModelPropertyOptional()
   type: Array<string>;
   @ApiModelPropertyOptional()
   price: Array<number>;
}