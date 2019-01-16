import { Engine } from './base';

export class AsyncStorage extends Engine {
   open(): Promise<void> {
      return Promise.resolve();
   }
}
