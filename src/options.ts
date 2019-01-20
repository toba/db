import { DataType } from './providers';

/**
 * An options object that configures the behavior of `set()` calls. These calls
 * can be configured to perform granular merges instead of overwriting the
 * target documents in their entirety by providing a `SetOptions` with
 * `merge: true`.
 * @see https://firebase.google.com/docs/reference/js/firebase.firestore.SetOptions
 */
export interface SetOptions<T extends DataType> {
   /**
    * Changes the behavior of a `set()` call to only replace the values
    * specified in its data argument. Fields omitted from the `set()` call
    * remain untouched.
    */
   merge?: boolean;

   /**
    * Changes the behavior of `set()` calls to only replace the specified field
    * paths. Any field path that is not specified is ignored and remains
    * untouched.
    */
   mergeFields?: (keyof T)[];
}
