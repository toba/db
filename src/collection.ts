import { Document, Query, Result, SortDirection, Operator, Boundary } from './';
import { DataProvider, DataEntity } from './providers';
import { is } from '@toba/tools';

export class Collection<T> extends DataEntity {
   /**
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#id
    */
   id: string;

   /**
    * A reference to the containing `Document` if this is a subcollection. If
    * this isn't a subcollection, the reference is null.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#parent
    */
   parent: Document<T> | null;

   constructor(provider: DataProvider, id: string) {
      super(provider);
      this.id = id;
   }

   /**
    * Adds a new document to this collection with the specified data, assigning
    * it a document ID automatically.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#add
    */
   add(data: T): Document<T> {
      const doc = new Document(this);
      doc.set(data);
      // TODO: save
      return doc;
   }

   /**
    * Gets a `Document` for the document within the collection with the ID. If
    * no ID is specified, an automatically-generated unique ID will be used for
    * the returned `Document`.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#doc
    */
   async doc(id?: string): Promise<Document<T>> {
      if (is.empty(id)) {
         return new Document(this);
      }
      const doc = new Document(this, id);
      return this.provider.getDocument(doc);
   }

   /**
    * Creates a new query where the results end at the provided document
    * (inclusive). The end position is relative to the order of the query. The
    * document must contain all of the fields provided in the `orderBy` of this
    * query.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#endAt
    */
   endAt = (value: Boundary<T>): Query<T> => new Query(this).endAt(value);

   /**
    * Creates a new query where the results end before the provided document
    * (exclusive). The end position is relative to the order of the query. The
    * document must contain all of the fields provided in the `orderBy` of this
    * query.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#endBefore
    */
   endBefore = (value: Boundary<T>): Query<T> =>
      new Query(this).endBefore(value);

   /**
    * Executes the query and returns the results as a QuerySnapshot.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#get
    */
   // get(): Result<T> {
   //    return new Result(null, null);
   // }

   /**
    * Returns `true` if this CollectionReference is equal to the provided one.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#isEqual
    */
   isEqual<T>(other: Collection<T>): boolean {
      return true;
   }

   /**
    * Creates a new query where the results are limited to the specified number
    * of documents.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#limit
    */
   limit = (count: number): Query<T> => new Query(this).limit(count);

   /**
    * Creates a new query where the results are sorted by the specified field,
    * in descending or ascending order.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#orderBy
    */
   orderBy = (
      fieldName: keyof T,
      direction: SortDirection = SortDirection.Ascending
   ): Query<T> => new Query(this).orderBy(fieldName, direction);

   /**
    * Creates a new query where the results start after the provided document
    * (exclusive). The starting position is relative to the order of the query.
    * The document must contain all of the fields provided in the `orderBy` of
    * this query.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#startAfter
    */
   startAfter = (value: Boundary<T>): Query<T> =>
      new Query(this).startAfter(value);

   /**
    * Creates a new query where the results start at the provided document
    * (inclusive). The starting position is relative to the order of the query.
    * The document must contain all of the fields provided in the `orderBy` of
    * the query.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#startAt
    */
   startAt = (value: Boundary<T>): Query<T> => new Query(this).startAt(value);

   /**
    * Creates a new query that returns only documents that include the specified
    * fields and where the values satisfy the constraints provided.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference#where
    */
   where = <K extends keyof T>(
      fieldName: K,
      operator: Operator,
      value: T[K]
   ): Query<T> => new Query(this).where(fieldName, operator, value);
}
