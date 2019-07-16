import { DataType } from './types';
/**
 * An options object that configures the behavior of `set()` calls. These calls
 * can be configured to perform granular merges instead of overwriting the
 * target documents in their entirety by providing a `SetOptions` with
 * `merge: true`.
 * @see https://firebase.google.com/docs/reference/js/firebase.firestore.SetOptions
 */
export interface SetOptions<T extends DataType> {
    /**
     * If `true` then only document values with new set values will be replaced.
     * Otherwise, all document data will be replaced with the new values.
     */
    merge?: boolean;
    /**
     * Specify field names to have only those specific fields replaced by the
     * new values.
     */
    mergeFields?: (keyof T)[];
}
