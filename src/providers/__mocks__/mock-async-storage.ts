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

   /**
    * Number of stored items.
    */
   size = (): number => this.store.size;
   getStore = (): Map<K, V> => new Map(this.store);

   /**
    * Invoke callback with value if defined.
    */
   protected success<T>(cb?: Callback<T>, value?: T) {
      if (cb !== undefined) {
         if (value === undefined) {
            // normally this wouldn't be necessary but affects Jest tests
            cb(null);
         } else {
            cb(null, value);
         }
      }
      return value;
   }

   /**
    * Send error to callback if callback is defined.
    */
   protected error(cb?: Callback<any>, err?: Error | Error[]) {
      if (cb !== undefined) {
         cb(err);
      }
   }

   /**
    * Fetches an item for a `key` and invokes a callback upon completion.
    * @see https://facebook.github.io/react-native/docs/asyncstorage#getitem
    */
   async getItem(key: K, cb?: Callback<V>): Promise<V | null> {
      const value = this.store.has(key) ? this.store.get(key)! : null;
      this.success(cb, value === null ? undefined : value);
      return value;
   }

   /**
    * Sets the value for a `key` and invokes a callback upon completion.
    * @see https://facebook.github.io/react-native/docs/asyncstorage#setitem
    */
   async setItem(key: K, value: V, cb?: Callback<V>): Promise<void> {
      this.store.set(key, value);
      this.success(cb);
   }

   /**
    * Removes an item for a `key` and invokes a callback upon completion.
    * @see https://facebook.github.io/react-native/docs/asyncstorage#removeitem
    */
   async removeItem(key: K, cb?: Callback<V>): Promise<void> {
      this.store.delete(key);
      this.success(cb);
   }

   /**
    * Erases *all* `AsyncStorage` for all clients, libraries, etc. You probably
    * don't want to call this; use `removeItem` or `multiRemove` to clear only
    * your app's keys.
    * @see https://facebook.github.io/react-native/docs/asyncstorage#clear
    */
   async clear(cb?: Callback<V>): Promise<void> {
      this.store.clear();
      this.success(cb);
   }

   /**
    * Gets *all* keys known to your app; for all callers, libraries, etc.
    * @see https://facebook.github.io/react-native/docs/asyncstorage#getallkeys
    */
   async getAllKeys(cb?: Callback<K[]>): Promise<K[]> {
      const keys = Array.from(this.store.keys());
      return this.success(cb, keys);
   }

   /**
    * This allows you to batch the fetching of items given an array of `key`
    * inputs. Your callback will be invoked with an array of corresponding
    * key-value pairs found.
    * @example
    *    multiGet(['k1', 'k2'], cb) -> cb([['k1', 'val1'], ['k2', 'val2']])
    * @see https://facebook.github.io/react-native/docs/asyncstorage#multiget
    */
   async multiGet(
      keys: Array<K>,
      cb?: Callback<Entries<K, V>>
   ): Promise<Entries<K, V>> {
      const entries = Array.from(this.store.entries());
      const requested = entries.filter(([k]) => keys.includes(k));
      return this.success(cb, requested);
   }

   /**
    * Use this as a batch operation for storing multiple key-value pairs. When
    * the operation completes you'll get a single callback with any errors.
    * @example
    *    multiSet([['k1', 'val1'], ['k2', 'val2']], cb);
    * @see https://facebook.github.io/react-native/docs/asyncstorage#multiset
    */
   async multiSet(entries: Entries<K, V>, cb?: Callback<V>): Promise<void> {
      for (const [key, value] of entries) {
         this.store.set(key, value);
      }
      this.success(cb);
   }

   /**
    * Call this to batch the deletion of all `keys` in the keys array.
    * @see https://facebook.github.io/react-native/docs/asyncstorage#multiremove
    */
   async multiRemove(keys: K[], cb?: Callback<V>): Promise<void> {
      for (const key of keys) {
         this.store.delete(key);
      }
      this.success(cb);
   }
}

/**
 * An in-memory version of React Native AsyncStorage.
 * @see https://facebook.github.io/react-native/docs/asyncstorage
 */
export class MockAsyncStorage extends AsyncDict<string, string> {
   /**
    * Merges an existing `key` value with an input value, assuming both values
    * are stringified JSON. *This is not supported by all native
    * implementations.*
    * @see https://facebook.github.io/react-native/docs/asyncstorage#mergeitem
    */
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
      this.success(cb);
   }

   /**
    * Batch operation to merge in existing and new values for a given set of
    * keys. This assumes that the values are stringified JSON. *This is not
    * supported by all native implementations.*
    * @see https://facebook.github.io/react-native/docs/asyncstorage#multimerge
    */
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
         this.error(cb, errors);
         return Promise.reject(errors);
      }
      this.success(cb);

      return Promise.resolve();
   }

   /**
    * Flushes any pending requests using a single batch call to get the data.
    * @see https://facebook.github.io/react-native/docs/asyncstorage#flushgetrequests
    */
   flushGetRequests() {
      return;
   }
}
