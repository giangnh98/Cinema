import {
   ApiModelProperty
} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class PrebookingParams {
   @ApiModelProperty() showtime: string;
   @ApiModelProperty() seat: string;
}

export class PrebookingArrayPrams {
   @ApiModelProperty({ type: PrebookingParams, isArray: true }) seats: PrebookingParams[];
}