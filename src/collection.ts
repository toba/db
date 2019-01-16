import { Document } from './';
import { Engine } from './engines';

export class Collection<T> {
   private engine: Engine;
   name: string;

   constructor(engine: Engine, name: string) {
      this.engine = engine;
      this.name = name;
   }

   add(document: Document<T>): this {
      return this;
   }
}
