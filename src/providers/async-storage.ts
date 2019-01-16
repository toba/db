import { DataProvider } from './base';

export class AsyncStorage extends DataProvider {
   open(): Promise<void> {
      return Promise.resolve();
   }
}
