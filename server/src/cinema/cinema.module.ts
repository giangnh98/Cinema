import { Module } from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { CinemaController } from './cinema.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Cinema } from "./models/cinema.model";

@Module({
  imports: [MongooseModule.forFeature([{name: Cinema.modelName, schema: Cinema.model.schema}])],
  providers: [CinemaService],
  controllers: [CinemaController],
  exports: [CinemaService]
})
export class CinemaModule {}
