import { mergeAll } from '@toba/tools';

type Entry<K, V> = [K, V];
type Entries<K, V> = Entry<K, V>[];
type Callback<V> = (err: Error[] | Error | null, value?: V) => void;

/**
 * TypeScript conversion of `devmetal/mock-async-storage` by Metál Ádám.
 * @see https://github.com/devmetal/mock-async-storage
 */
class AsyncDict<K, V> {
   store: Map<K, V>;

   constructor() {
      this.store = new Map();
   }

   size = (): number => this.store.size;

   getStore = (): Map<K, V> => new Map(this.store);

   async getItem(key: K, cb?: Callback<V>): Promise<V | null> {
      const value = this.store.has(key) ? this.store.get(key)! : null;

      if (cb !== undefined) {
         cb(null, value === null ? undefined : value);
      }
      return value;
   }

   async setItem(key: K, value: V, cb?: Callback<V>): Promise<void> {
      this.store.set(key, value);

      if (cb !== undefined) {
         cb(null);
      }
   }

   async removeItem(key: K, cb?: Callback<V>): Promise<void> {
      this.store.delete(key);
      if (cb !== undefined) {
         cb(null);
      }
   }

   async clear(cb?: Callback<V>): Promise<void> {
      this.store.clear();
      if (cb !== undefined) {
         cb(null);
      }
   }

   async getAllKeys(cb?: Callback<K[]>): Promise<K[]> {
      const keys = Array.from(this.store.keys());
      if (cb !== undefined) {
         cb(null, keys);
      }
      return keys;
   }

   async multiGet(
      keys: Array<K>,
      cb?: Callback<Entries<K, V>>
   ): Promise<Entries<K, V>> {
      const entries = Array.from(this.store.entries());
      const requested = entries.filter(([k]) => keys.includes(k));

      if (cb !== undefined) {
         cb(null, requested);
      }
      return requested;
   }

   async multiSet(entries: Entries<K, V>, cb?: Callback<V>): Promise<void> {
      for (const [key, value] of entries) {
         this.store.set(key, value);
      }
      if (cb !== undefined) {
         cb(null);
      }
   }

   async multiRemove(keys: K[], cb?: Callback<V>): Promise<void> {
      for (const key of keys) {
         this.store.delete(key);
      }
      if (cb !== undefined) {
         cb(null);
      }
   }
}

export class MockAsyncStorage extends AsyncDict<string, string> {
   async mergeItem(
      key: string,
      valueText: string,
      cb?: Callback<string>
   ): Promise<void> {
      let merged: Object;
      const itemText = await this.getItem(key);

      if (itemText === undefined) {
         throw new Error(`No item with ${key} key`);
      }

      try {
         const item = JSON.parse(itemText!);
         const value = JSON.parse(valueText);
         merged = mergeAll(item, value);
      } catch (_err) {
         throw new Error(`Unable to merge new value for ${key}`);
      }

      await this.setItem(key, JSON.stringify(merged));

      if (cb !== undefined) {
         cb(null);
      }
   }

   async multiMerge(
      entries: Entries<string, string>,
      cb?: Callback<string>
   ): Promise<void> {
      const errors: Array<Error> = [];

      for (const [key, value] of entries) {
         try {
            await this.mergeItem(key, value);
         } catch (err) {
            errors.push(err);
         }
      }

      if (errors.length) {
         if (cb !== undefined) {
            cb(errors);
         }
         return Promise.reject(errors);
      }

      if (cb !== undefined) {
         cb(null);
      }
      return Promise.resolve();
   }

   flushGetRequests() {}
}
