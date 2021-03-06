import { Document, Result, Collection } from './'
import { DataType } from './types'

export enum SortDirection {
   Ascending,
   Descending
}

export type Operator = '>' | '>=' | '<' | '<=' | '==' | 'contains'

export type Boundary<T extends DataType> = Document<T> | Partial<T>

export interface Range<T extends DataType> {
   endAt?: Boundary<T>
   endBefore?: Boundary<T>
   startAfter?: Boundary<T>
   startAt?: Boundary<T>
}

export interface Match<T extends DataType, K extends keyof T> {
   field?: K
   value?: T[K] | Array<T[K]>
   operator?: Operator
}

export interface Sort<T extends DataType> {
   field?: keyof T
   direction?: SortDirection
}

/**
 * A `Query` refers to a Query which you can read or listen to. You can also
 * construct refined `Query` objects by adding filters and ordering.
 * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Query
 */
export class Query<T extends DataType> {
   #collection: Collection<T>
   max: number = 0
   sort: Sort<T> = {}
   match: Match<T, keyof T> = {}
   range: Range<T> = {}

   /**
    * @param collection Collection the query will run against
    */
   constructor(collection: Collection<T>) {
      this.#collection = collection
   }

   /**
    * Creates a new query where the results end at the provided document
    * (inclusive). The end position is relative to the order of the query. The
    * document must contain all of the fields provided in the `orderBy` of this
    * query.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Query.html#endat
    */
   endAt(value: Boundary<T>): this {
      this.range.endAt = value
      return this
   }

   /**
    * Creates a new query where the results end before the provided document
    * (exclusive). The end position is relative to the order of the query. The
    * document must contain all of the fields provided in the `orderBy` of this
    * query.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Query.html#endBefore
    */
   endBefore(value: Boundary<T>): this {
      this.range.endBefore = value
      return this
   }

   /**
    * Executes the query and returns the results.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Query.html#get
    */
   get = (): Result<T> => this.#collection.client.query(this)

   /**
    * Creates a new query where the results are limited to the specified number
    * of documents.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Query.html#limit
    */
   limit(count: number): this {
      this.max = count
      return this
   }

   /**
    * Creates a new query where the results are sorted by the specified field,
    * in descending or ascending order.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Query.html#orderBy
    */
   orderBy(
      fieldName: keyof T,
      direction: SortDirection = SortDirection.Ascending
   ): this {
      this.sort.field = fieldName
      this.sort.direction = direction
      return this
   }

   /**
    * Creates a new query where the results start after the provided document
    * (exclusive). The starting position is relative to the order of the query.
    * The document must contain all of the fields provided in the `orderBy` of
    * this query.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Query.html#startAfter
    */
   startAfter(value: Boundary<T>): this {
      this.range.startAfter = value
      return this
   }

   /**
    * Creates a new query where the results start after the provided document
    * (inclusive). The starting position is relative to the order of the query.
    * The document must contain all of the fields provided in the `orderBy` of
    * this query.
    * @see https://firebase.google.com/docs/reference/js/firebase.firestore.Query.html#startAfter
    */
   startAt(value: Boundary<T>): this {
      this.range.startAt = value
      return this
   }

   where<K extends keyof T>(
      fieldName: K,
      operator: Operator,
      value: T[K] | Array<T[K]>
   ): this {
      this.match.field = fieldName
      this.match.operator = operator
      this.match.value = value

      return this
   }
}
