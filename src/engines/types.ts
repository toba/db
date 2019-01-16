import { Database } from '../';

export interface Engine {
   open(name: string, version?: number): Promise<Database>;
}
