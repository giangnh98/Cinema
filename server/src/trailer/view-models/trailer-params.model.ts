import {
    ApiModelProperty
 } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
 
 export class TrailerParams {
    @ApiModelProperty() movie: string;
    @ApiModelProperty() videoId: string;
 }