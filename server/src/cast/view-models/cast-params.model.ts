import { ApiModelPropertyOptional } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class CastParams {
   @ApiModelPropertyOptional()
   actor: string;
   @ApiModelPropertyOptional()
   movie: string;
   @ApiModelPropertyOptional()
   castName: string;
}