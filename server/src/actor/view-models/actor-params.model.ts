import { ApiModelPropertyOptional } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class ActorParams {
   @ApiModelPropertyOptional() name: string;
   @ApiModelPropertyOptional() image: string;
}