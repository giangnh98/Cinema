import {
    ApiModelProperty
} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class SeatParams {
    @ApiModelProperty() seatRow: string;
    @ApiModelProperty() seatCol: string;
    @ApiModelProperty({ default: 0 }) seatType?: number;
    @ApiModelProperty() graphRow: number;
    @ApiModelProperty() graphCol: number;
    @ApiModelProperty({ default: false }) isLoverL?: boolean;
}

export class SeatArrayParams {
    @ApiModelProperty() room: string;
    @ApiModelProperty({ type: SeatParams, isArray: true }) seats: SeatParams[];
}