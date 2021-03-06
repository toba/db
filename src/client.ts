import { is, EventEmitter } from '@toba/tools'
import {
   Document,
   Collection,
   Query,
   Schema,
   Result,
   CollectionSchema,
   indexName
} from '.'
import { domStringListToArray } from './tools'
import { DataType } from './types'

export enum AccessType {
   ReadWrite = 'readwrite',
   ReadOnly = 'readonly',
   Upgrade = 'versionchange'
}

export enum DataEvent {
   Error
}

/**
 * All object store data extends `DataType` which specifies `id` as the primary
 * key. By default, `id` is an automatically generated `ULID`.
 * @see https://github.com/ulid/javascript
 */
const createOptions: IDBObjectStoreParameters = {
   keyPath: 'id',
   autoIncrement: false
}

/**
 * `DataClient` is the IndexedDB client. It is initialized with a `Schema` that
 * defines the structure of the data.
 *
 * IndexedDB uses object stores rather than tables and a single database can
 * contain any number of object stores. Whenever a value is stored in an object
 * store, it is associated with a key. There are several different ways that a
 * key can be supplied depending on whether the object store uses a key path or
 * a key generator.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
 */
export class DataClient extends EventEmitter<DataEvent, any> {
   #schema: Schema
   /**
    * The open database. It will be `null` if the database hasn't yet been
    * opened.
    */
   #db: IDBDatabase | null = null

   constructor(schema: Schema) {
      super()
      this.#schema = schema
   }

   protected get name() {
      return this.#schema.name
   }

   protected get version() {
      return this.#schema.version
   }

   protected get collectionSchemas() {
      return this.#schema.collections
   }

   /**
    * Ensure databse is created and open.
    */
   private ensureDB = (): Promise<IDBDatabase> =>
      this.#db !== null
         ? Promise.resolve(this.#db)
         : new Promise(async resolve => {
              await this.open()
              resolve(this.#db!)
           })

   /**
    *
    * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#Opening_a_database
    *
    * The most likely error condition is the user declining web app permission
    * to create a database.
    */
   open = () =>
      new Promise<void>((resolve, reject) => {
         const req = indexedDB.open(this.name, this.version)

         req.onerror = this.onError(req, reject)
         req.onsuccess = this.onSuccess(req, resolve)
         req.onupgradeneeded = this.upgrade(req)
      })

   close() {
      if (this.#db !== null) {
         this.#db.close()
         this.#db = null
      }
   }

   /**
    * @param closeDatabase Whether to close the database before raising the error
    */
   private onError = (
      req: IDBOpenDBRequest,
      cb: (er: DOMException | null) => void,
      closeDatabase: boolean = true
   ) => () => {
      if (closeDatabase) {
         this.close()
      }
      cb(req.error)
      this.removeAll(DataEvent.Error)
   }

   /**
    * If the database exists and is the same version as requested then this
    * event will occur immediately after opening. Otherwise `onupgradeneeded`
    * will happen first.
    */
   private onSuccess = (req: IDBOpenDBRequest, cb: () => void) => () => {
      this.#db = req.result
      cb()

      this.#db.onerror = (event: Event) => {
         // TODO: evaluate whether db should be closed
         this.emit(DataEvent.Error, event)
      }
   }

   /**
    * If no previous version exists, all object stores and indexes should be
    * created in this method.
    *
    * If a previous version exists, it is only necessary to implement the
    * differences. Note that an object store cannot have its `keyPath` (primary
    * key) altered in place. Its data would need to be copied out and a new
    * object store created to hold those data.
    *
    * The normal `onsuccess` event will happen when the upgrade completes.
    *
    * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#Creating_or_updating_the_version_of_the_database
    */
   private upgrade = (req: IDBOpenDBRequest) => (
      _ev: IDBVersionChangeEvent
   ) => {
      const db = req.result

      this.collectionSchemas.forEach(c => {
         const os = db.createObjectStore(c.name, createOptions)

         if (is.array(c.indexes)) {
            c.indexes.forEach(i => {
               // the index field is defined as keyOf DataType which requires
               // string keys, yet still resolves as number | string, hence
               // the coercion
               os.createIndex(indexName(i), i.field as string | string[], {
                  unique: i.unique
               })
            })
         }
      })
   }

   /**
    * Names of collections created within the data store.
    */
   async collectionNames(): Promise<string[]> {
      const db = await this.ensureDB()
      return domStringListToArray(db.objectStoreNames)
   }

   // overloads
   async indexNames(collectionID: string): Promise<string[]>
   async indexNames<T extends DataType>(
      schema: CollectionSchema<T>
   ): Promise<string[]>
   /**
    * Names of all indexes in a collection.
    */
   async indexNames<T extends DataType>(
      schemaOrID: string | CollectionSchema<T>
   ): Promise<string[]> {
      const id: string = is.text(schemaOrID) ? schemaOrID : schemaOrID.name
      const os = await this.objectStore(id)
      return domStringListToArray(os.indexNames)
   }

   // overloads
   private async objectStore(
      id: string,
      access?: AccessType
   ): Promise<IDBObjectStore>
   private async objectStore<T extends DataType>(
      doc: Document<T>,
      access?: AccessType
   ): Promise<IDBObjectStore>
   /**
    * Create and return an object store transaction. If more than one object
    * store should participate in the transaction then the transaction and its
    * object stores should be created and retrieved step-by-step.
    */
   private async objectStore<T extends DataType>(
      docOrID: Document<T> | string,
      access: AccessType = AccessType.ReadOnly
   ): Promise<IDBObjectStore> {
      const db = await this.ensureDB()
      const id = is.text(docOrID) ? docOrID : docOrID.parent.id
      return db.transaction(id, access).objectStore(id)
   }

   saveDocument = <T extends DataType>(doc: Document<T>) =>
      new Promise<void>(async (resolve, reject) => {
         const os = await this.objectStore(doc, AccessType.ReadWrite)
         const req: IDBRequest<IDBValidKey> = os.add(doc.data())

         req.onsuccess = () => resolve()
         req.onerror = () => reject()
      })

   deleteDocument = <T extends DataType>(doc: Document<T>) =>
      new Promise<void>(async (resolve, reject) => {
         const os = await this.objectStore(doc, AccessType.ReadWrite)
         const req: IDBRequest = os.delete(doc.id)

         req.onsuccess = () => resolve()
         req.onerror = () => reject()
      })

   // overloads
   getDocument<T extends DataType>(doc: Document<T>): Promise<Document<T>>
   getDocument<T extends DataType>(
      collection: CollectionSchema<T>,
      id: string
   ): Promise<Document<T>>
   /**
    * Retrieve a single document. A new transaction will always be created to
    * save the document so this operation can always be read-only. Method will
    * return `undefined` if the document isn't found.
    */
   getDocument<T extends DataType>(
      docOrSchema: Document<T> | CollectionSchema<T>,
      id?: string
   ) {
      return new Promise<Document<T>>(async (resolve, reject) => {
         const doc = this.ensureDoc(docOrSchema, id)
         const os = await this.objectStore(doc)
         const req: IDBRequest<T> = os.get(doc.id)

         req.onsuccess = () => {
            if (req.result === undefined) {
               resolve(undefined)
            } else {
               doc.setWithoutSaving(req.result)
               resolve(doc)
            }
         }

         req.onerror = () => {
            reject()
         }
      })
   }

   /**
    * Support `getDocument()` by normalizing the overloads.
    */
   private ensureDoc<T extends DataType>(
      docOrSchema: Document<T> | CollectionSchema<T>,
      id?: string
   ): Document<T> {
      if (docOrSchema instanceof Document) {
         return docOrSchema
      } else {
         const schema = docOrSchema
         if (id === undefined) {
            throw Error(
               `No ID given to retrieve document from "${schema.name}" collection`
            )
         }
         const c = new Collection<T>(this, schema)
         return new Document<T>(c, id)
      }
   }

   /**
    * key range search
    * @see https://github.com/mdn/indexeddb-examples/blob/master/idbkeyrange/scripts/main.js
    *
    * compound query example
    * @see https://stackoverflow.com/a/15625231/6823622
    */
   query<T extends DataType>(q: Query<T>): Result<T> {
      return new Result(q, [])
   }
}
