import { ApiModelPropertyOptional } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class RoomParams {
   @ApiModelPropertyOptional()
   cinema: string;
   @ApiModelPropertyOptional()
   name: string;
   @ApiModelPropertyOptional()
   seats: number;
   @ApiModelPropertyOptional()
   structure: Array<Array<number>>;
}