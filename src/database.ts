import { Collection } from './';
import { DataProvider, DataType, DataEntity } from './providers/';

export class Database extends DataEntity {
   version: number;

   constructor(provider: DataProvider, name: string, version: number = 1) {
      super(provider);
   }

   async open() {
      await this.provider.open();
   }

   async collection<T extends DataType>(
      name: string,
      primaryKey?: keyof T
   ): Promise<Collection<T>> {
      const c = await this.provider.getCollection<T>(name, primaryKey);
      return c;
   }
}
