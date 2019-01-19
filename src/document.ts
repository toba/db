import { is } from '@toba/tools';
import { ulid } from 'ulid';
import { DataType } from './providers';
import { Collection, SetOptions } from './';

/**
 * Combined features of a FireStore `DocumentReference` and `DocumentSnapshot`.
 * The `Document` is a reference to the actual stored data which are accessed
 * with the `data()` method.
 *
 * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot
 * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference
 */
export class Document<T extends DataType> {
   /**
    * The document's identifier within its collection. This is the same value
    * contained within the data (`DataType`) itself.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference#id
    */
   id: string;

   /**
    * Collection this document belongs to.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference#parent
    */
   parent: Collection<T>;

   /**
    * All data contained by the document.
    */
   private values?: T;

   /**
    * Create an empty document.
    */
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
    * Retrieve all fields in the document as an Object. Returns `undefined` if
    * the document doesn't exist.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot#data
    */
   data = () => this.values;

   /**
    * Retrieve the field value specified by `key`. Returns `undefined` if
    * the `key` doesn't exist.
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
    * Update fields in the document. The update will fail if applied to a
    * document that does not exist.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference#update
    */
   update = (values: T): Promise<void> =>
      this.values === undefined ? Promise.reject() : this.set(values);

   /**
    * Save new document data in provider. If the document does not exist yet, it
    * will be created. Options may be passed to merge new values instead of
    * completely replacing existing values.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference#set
    */
   set(values: T, options?: SetOptions<T>): Promise<void> {
      this.setWithoutSaving(values);
      return this.parent.provider.saveDocument(this, options);
   }

   toString = () => JSON.stringify(this.values);

   /**
    * Set document values without saving them. This will typically only be used
    * by data providers.
    */
   setWithoutSaving(values: T) {
      if (values.id !== undefined && values.id !== this.id) {
         throw new Error(
            `Document ID ${this.id} does not match data ID ${values.id}`
         );
      }
      this.values = values;
   }
}
