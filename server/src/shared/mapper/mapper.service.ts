import { Injectable } from "@nestjs/common";
import "automapper-ts/dist/automapper";

@Injectable()
export class MapperService {
   mapper: AutoMapperJs.AutoMapper;
   
   constructor() {
      this.mapper = automapper;
      this.initializeMapper();
   }
   
   private initializeMapper(): void {
      this.mapper.initialize(MapperService.configure);
   }
   
   private static configure(config: AutoMapperJs.IConfiguration): void {
      config.createMap("User", "UserVm")
         .forSourceMember("_id", opts => opts.ignore())
         .forSourceMember("password", opts => opts.ignore());
      config.createMap("User[]", "UserVm[]")
         .forSourceMember("_id", opts => opts.ignore())
         .forSourceMember("password", opts => opts.ignore());
      
      config.createMap("Movie", "MovieVm")
         .forSourceMember("_id", opts => opts.ignore);
      config.createMap("Movie[]", "MovieVm[]")
         .forSourceMember("_id", opts => opts.ignore);
      
      config.createMap("Cinema", "CinemaVm")
         .forSourceMember("_id", opts => opts.ignore);
      config.createMap("Cinema[]", "CinemaVm[]")
         .forSourceMember("_id", opts => opts.ignore);
   }
}
