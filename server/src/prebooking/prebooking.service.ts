import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { BaseService } from "../shared/base.service";
import { Prebooking } from "./models/prebooking.model";
import { InjectModel } from "@nestjs/mongoose";
import { ModelType } from "typegoose";
import { MapperService } from "../shared/mapper/mapper.service";
import { map } from "lodash";

@Injectable()
export class PrebookingService extends BaseService<Prebooking> {
   constructor(
      @InjectModel(Prebooking.modelName)
      private readonly _prebookingModel: ModelType<Prebooking>,
      private readonly _mapperService: MapperService
   ) {
      super(_prebookingModel, _mapperService.mapper);
   }
   
   async findAllWithPaginate(pageSize, page, sort): Promise<Prebooking[]> {
      try {
         const prebooking = await this._prebookingModel.find()
            .sort(sort).skip(pageSize * page).limit(parseInt(pageSize)).exec();
         return map(prebooking, item => item.toJSON() as Prebooking);
      } catch (e) {
         throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
}
