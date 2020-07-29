import { ApiModelPropertyOptional } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class ApiException {
   @ApiModelPropertyOptional() statusCode?: number;
   @ApiModelPropertyOptional() error?: string;
   @ApiModelPropertyOptional() message?: string;
   @ApiModelPropertyOptional() errors?: string;
   @ApiModelPropertyOptional() timestamp?: string;
   @ApiModelPropertyOptional() _path?: string;
   
   constructor(
      statusCode?: number,
      error?: string,
      errors?: string,
      message?: string,
      _path?: string,
      timestamp?: string,
   ) {
      this.statusCode = statusCode;
      this.error = error;
      this.message = message;
      this.errors = errors;
      this._path = _path;
      this.timestamp = new Date().toISOString();
   }
}