import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SharedModule } from "./shared/shared.module";
import { ConfigurationService } from "./shared/configuration/configuration.service";
import { Configuration } from "./shared/configuration/configuration.enum";
import { UserModule } from "./user/user.module";
import { JwtStrategyService } from "./shared/auth/strategies/jwt-strategy.service";
import { MovieModule } from "./movie/movie.module";
import { CinemaModule } from "./cinema/cinema.module";
import { RoomModule } from "./room/room.module";
import { TicketModule } from "./ticket/ticket.module";
import { ShowtimeModule } from "./showtime/showtime.module";
import { PrebookingModule } from "./prebooking/prebooking.module";

@Module({
   imports: [
      SharedModule,
      MongooseModule.forRoot(ConfigurationService.connectionString, {
         useNewUrlParser: true,
         useCreateIndex: true,
         useFindAndModify: false,
         useUnifiedTopology: true
      }),
      UserModule,
      MovieModule,
      CinemaModule,
      RoomModule,
      TicketModule,
      ShowtimeModule,
      PrebookingModule,
   ],
   controllers: [AppController],
   providers: [AppService, JwtStrategyService]
})
export class AppModule {
   static host: string;
   static port: number | string;
   static isDev: boolean;
   
   constructor(private readonly _configurationService: ConfigurationService) {
      AppModule.port = AppModule.normalizePort(_configurationService.get(Configuration.PORT));
      AppModule.host = _configurationService.get(Configuration.HOST);
      AppModule.isDev = _configurationService.isDevelopment;
   }
   
   private static normalizePort(param: number | string): number | string {
      const portNumber: number = typeof param === "string" ? parseInt(param, 10) : param;
      if (isNaN(portNumber)) return param;
      else if (portNumber >= 0) return portNumber;
   }
}
