import { is } from '@toba/tools';
import { ulid } from 'ulid';
import { Collection } from './collection';
import { SetOptions } from './options';

/**
 * Document combines the features of a FireStore `DocumentReference` and
 * `DocumentSnapshot`.
 *
 * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot
 * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference
 */
export class Document<T> {
   /**
    * The document's identifier within its collection.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference#id
    */
   id: string;

   /**
    * Collection this document belongs to.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference#parent
    */
   parent: Collection<T>;
   values?: T;

   constructor(parent: Collection<T>, id: string = ulid()) {
      if (is.empty(id)) {
         throw new Error('Cannot create document without an ID');
      }
      this.parent = parent;
      this.id = id;
   }

   /**
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot#~exists
    */
   get exists() {
      return is.value<T>(this.values);
   }

   /**
    * Retrieves all fields in the document as an Object. Returns `undefined` if
    * the document doesn't exist.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot#data
    */
   data = () => this.values;

   /**
    * Retrieves the field specified by fieldPath. Returns `undefined` if the
    * document or field doesn't exist.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot#get
    */
   get = <K extends keyof T>(key: K): T[K] | undefined =>
      this.values !== undefined ? this.values[key] : this.values;

   /**
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference#delete
    */
   delete = (): Promise<void> =>
      this.parent.provider.deleteDocument(this)
         ? Promise.resolve()
         : Promise.reject();

   /**
    * Updates fields in the document. The update will fail if applied to a
    * document that does not exist.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference#update
    */
   update = (values: T): Promise<void> =>
      this.values === undefined ? Promise.reject() : this.set(values);

   /**
    * Writes to the document. If the document does not exist yet, it will be
    * created. If you pass options, the provided data can be merged into the
    * existing document.
    */
   set(values: T, options?: SetOptions<T>): Promise<void> {
      this.values = values;
      return this.parent.provider.saveDocument(this, options);
   }

   toString = () => JSON.stringify(this.values);
}
