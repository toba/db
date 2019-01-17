import { Document } from './';
import { DataProvider, DataEntity } from './providers';

export class Collection<T> extends DataEntity {
   name: string;

   constructor(provider: DataProvider, name: string) {
      super(provider);
      this.name = name;
   }

   add(document: Document<T>): this {
      return this;
   }
}
