import {
   ApiModelProperty
} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class PrebookingParams {
   @ApiModelProperty() showtime: string;
   @ApiModelProperty() seats: Array<Array<number>>;
}