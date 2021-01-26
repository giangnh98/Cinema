import { Types } from "mongoose";
import "automapper-ts/dist/automapper";
import { ModelType, Typegoose, InstanceType } from "typegoose";

export abstract class BaseService<T extends Typegoose> {
   protected _model: ModelType<T>;
   protected _mapper: AutoMapperJs.AutoMapper;
   
   protected constructor(model: ModelType<T>, mapper: AutoMapperJs.AutoMapper) {
      this._model = model;
      this._mapper = mapper;
   }
   
   private get modelName(): string {
      return this._model.modelName;
   }
   
   private get viewModelName(): string {
      return `${this._model.modelName}Vm`;
   }
   
   createModel(doc?: Partial<T>): T {
      return new this._model(doc);
   }
   
   async map<K>(
      object: Partial<InstanceType<T>> | Partial<InstanceType<T>>[],
      isArray: boolean = false,
      sourceKey?: string,
      destinationKey?: string
   ): Promise<K> {
      const _sourceKey = isArray ? `${sourceKey || this.modelName}[]` : sourceKey || this.modelName;
      const _destinationKey = isArray
         ? `${destinationKey || this.viewModelName}[]`
         : destinationKey || this.viewModelName;
      
      return this._mapper.map(_sourceKey, _destinationKey, object);
   }
   
   async find(filter = {}): Promise<InstanceType<T>[]> {
      return this._model.find(filter).exec();
   }
   
   async findWithPopulate(filter = {}, populate = {}): Promise<InstanceType<T>[]> {
      return this._model.find(filter).populate(populate).exec();
   }

   async findOnePopulate(filter = {} , populate = {}): Promise<InstanceType<T>> {
      return this._model.findOne(filter).populate(populate);
   }
   
   async findWithPopulateAndSort(filter = {}, populate = {}, sort = {}): Promise<InstanceType<T>[]> {
      return this._model.find(filter).sort(sort).populate(populate).exec();
   }
   
   async findOne(filter = {}): Promise<InstanceType<T>> {
      return this._model.findOne(filter).exec();
   }
   
   async findById(id: string): Promise<InstanceType<T>> {
      return this._model.findById(this.toObjectId(id)).exec();
   }
   
   async findByIdWithPopulate(id: string, populate = {}): Promise<InstanceType<T>> {
      return this._model.findById(this.toObjectId(id)).populate(populate).exec();
   }
   
   async create(item: T): Promise<InstanceType<T>> {
      // @ts-ignore
      return this._model.create(item);
   }
   
   async delete(id: string): Promise<InstanceType<T>> {
      return this._model.findByIdAndRemove(this.toObjectId(id)).exec();
   }
   
   async update(id: string, item: InstanceType<T>): Promise<InstanceType<T>> {
      // @ts-ignore
      return this._model.findByIdAndUpdate(this.toObjectId(id), item, { new: true }).exec();
   }
   
   async clearCollection(filter = {}): Promise<void> {
      // @ts-ignore
      return this._model.deleteMany(filter).exec();
   }
   
   public toObjectId(id: string): Types.ObjectId {
      return Types.ObjectId(id);
   }
}