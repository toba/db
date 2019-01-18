import { Collection } from './';
import { DataProvider, DataType, DataEntity } from './providers/';

export class Database extends DataEntity {
   name: string;
   version: number;

   constructor(provider: DataProvider, name: string, version: number = 1) {
      super(provider);
      this.name = name;
      this.version = version;
   }

   open = () => this.provider.open();

   async collection<T extends DataType>(
      id: string,
      primaryKey?: keyof T
   ): Promise<Collection<T>> {
      const c = await this.provider.getCollection<T>(id, primaryKey);
      return c;
   }
}
