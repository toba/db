import { is, merge } from '@toba/tools'
import { ulid } from 'ulid'
import { DataType } from './types'
import { Collection, SetOptions } from './'

/**
 * Combined features of a FireStore `DocumentReference` and `DocumentSnapshot`.
 * The `Document` is a reference to the actual stored data which are accessed
 * with the `data()` method.
 *
 * A `Document` may exist without having any data (yet) in which case it is akin
 * to a reference.
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
   id: string

   /**
    * Collection this document belongs to.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference#parent
    */
   parent: Collection<T>

   /**
    * All data contained by the document.
    */
   private values?: T

   /**
    * Create an empty document. If no ID is provied than a ULID will be
    * generated.
    */
   constructor(parent: Collection<T>, id?: string)
   /**
    * Create a document containing the given data values. If the data don't
    * include an ID then a ULID will be generated.
    */
   constructor(parent: Collection<T>, data: T)
   constructor(parent: Collection<T>, dataOrID: string | T) {
      let id = ulid()

      if (is.object<T>(dataOrID)) {
         if (is.empty(dataOrID.id)) {
            dataOrID.id = id
         } else {
            id = dataOrID.id
         }
         this.values = dataOrID
      } else if (!is.empty(dataOrID)) {
         id = dataOrID
      }
      this.parent = parent
      this.id = id
   }

   /**
    * Whether the document exists in the data store.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot#~exists
    */
   get exists() {
      return is.value<T>(this.values)
   }

   /**
    * Document data (plain object) or `undefined` if the document doesn't exist.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot#data
    */
   data = () => this.values

   /**
    * The value of the field `key` in the document data or `undefined` if it
    * doesn't exist.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot#get
    */
   get = <K extends keyof T>(key: K): T[K] | undefined =>
      this.values !== undefined ? this.values[key] : undefined

   /**
    * Remove document data from the store.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference#delete
    */
   delete = (): Promise<void> =>
      this.parent.client.deleteDocument(this)
         ? Promise.resolve()
         : Promise.reject()

   /**
    * Replace document data with new values. An error will be emitted if the
    * document doesn't yet exist.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference#update
    */
   update = (values: Partial<T>): Promise<void> =>
      this.values === undefined
         ? Promise.reject()
         : this.set(values, { merge: true })

   /**
    * Save new document data. The document will be created if it doesn't exist.
    * Options may be passed to merge new values instead of completely replacing
    * existing values.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference#set
    */
   set(values: Partial<T>, options?: SetOptions<T>): Promise<void> {
      this.setWithoutSaving(values, options)
      return this.parent.client.saveDocument(this)
   }

   toString = () => JSON.stringify(this.values)

   /**
    * Set document values without saving them. This will typically only be used
    * by data providers.
    */
   setWithoutSaving(values: T | Partial<T>, options?: SetOptions<T>): this {
      if (values.id !== undefined && values.id !== this.id) {
         throw new Error(
            `Document ID "${this.id}" does not match data ID "${values.id}"`
         )
      }

      if (this.values === undefined || options === undefined) {
         // TODO: way to do this without type coercion?
         this.values = values as T
      } else if (options !== undefined) {
         if (is.array<keyof T>(options.mergeFields)) {
            // only merge the listed fields
            const selected: Partial<T> = {}
            options.mergeFields.forEach(f => {
               selected[f] = values[f] as T[keyof T] | undefined
            })
            this.values = merge(this.values, selected)
         } else if (options.merge === true) {
            // merge given values but otherwise leave existing data as is
            this.values = merge(this.values, values)
         }
      }
      return this
   }
}
