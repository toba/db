import { Collection } from './';
import { Engine, DataType } from './engines/';

export class Database {
   engine: Engine;
   version: number;

   constructor(engine: Engine, name: string, version: number = 1) {
      this.engine = engine;
   }

   async collection<T extends DataType>(
      name: string,
      primaryKey?: keyof T
   ): Promise<Collection<T>> {
      const c = await this.engine.getCollection<T>(name, primaryKey);
      //const c = new Collection(this.engine);
      return c;
   }
}
