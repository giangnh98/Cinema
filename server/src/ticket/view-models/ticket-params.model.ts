import { ApiModelPropertyOptional } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class TicketParams {
   @ApiModelPropertyOptional()
   showtime: string;
   @ApiModelPropertyOptional()
   seat: string;
   @ApiModelPropertyOptional()
   type: string;
   @ApiModelPropertyOptional()
   price: number;
   @ApiModelPropertyOptional()
   seatNo: string;
}

export class TicketArrayPrams {
   @ApiModelPropertyOptional({ type: TicketParams, isArray: true })
   seats: TicketParams[];
}