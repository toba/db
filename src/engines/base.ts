import { EventEmitter } from '@toba/tools';
import { Collection } from '../';

export interface DataType {
   [key: string]: any;
}

export enum EngineEvent {
   Error
}

export class Engine extends EventEmitter<EngineEvent, any> {
   isOpen: boolean;
   protected name: string;
   protected version: number;

   constructor(name: string, version: number = 1) {
      super();
      this.name = name;
      this.version = version;
   }

   open(): Promise<void> {
      return Promise.reject();
   }

   getCollection<T extends DataType>(
      name: string,
      primaryKey?: keyof T
   ): Promise<Collection<T>> {
      return Promise.reject();
   }

   addDocument<T extends DataType>(
      collectionName: string,
      data: T
   ): Promise<boolean> {
      return Promise.reject();
   }
}
