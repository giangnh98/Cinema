import {
   ApiModelProperty
} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class MovieParams {
   @ApiModelProperty() title: string;
   @ApiModelProperty() region: string;
   @ApiModelProperty() description: string;
   @ApiModelProperty() duration: string;
   @ApiModelProperty() genre: string;
   @ApiModelProperty() videoId: string;
   @ApiModelProperty() image: string;
   @ApiModelProperty() director: string;
   @ApiModelProperty({ type: String, format: "date-time" }) started?: Date;
   @ApiModelProperty() category: string;
}