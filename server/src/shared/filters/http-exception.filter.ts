import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { ApiException } from "../api-exception.model";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
   catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const res = ctx.getResponse();
      const req = ctx.getRequest();
      const status = exception.getStatus();
      const errorName = exception.response.name || exception.response.error || exception.name;
      const message = exception.response.message || exception.response || exception.message;
      const errors = exception.response.errors || null;
      const path = req ?  req.url : null;
      
      if (status === HttpStatus.UNAUTHORIZED) {
         if (typeof exception.response !== "string") {
            exception.response["message"] =
               exception.response.message || "You do not have permission to access this resource";
         }
      }
      
      const response = new ApiException(
         status,
         errorName,
         errors,
         message,
         path
      );
      
      res.status(status).json(response);
   }
}