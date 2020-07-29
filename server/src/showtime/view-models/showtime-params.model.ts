import { ApiModelPropertyOptional } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { ISeatPrice } from "../models/showtime-type.model";

export class ShowtimeParams {
   @ApiModelPropertyOptional()
   movie: string;
   @ApiModelPropertyOptional()
   room: string;
   @ApiModelPropertyOptional()
   released: string;
   @ApiModelPropertyOptional()
   time: string;
   @ApiModelPropertyOptional()
   seatPrice: ISeatPrice;
}