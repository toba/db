import { MimeType } from '@toba/tools'

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays#ArrayBuffer
 */
export const bufferToBlob = (buffer: ArrayBuffer, type: MimeType) =>
   new Blob([buffer], { type })

/**
 * "If you are storing large, user-generated files such as images or videos,
 * then you may try to store them as `File` or `Blob` objects. This will work on
 * some platforms but fail on others. Safari on iOS, in particular, cannot store
 * `Blob`s in IndexedDB.
 *
 * "Luckily it is not too difficult to convert a Blob into an `ArrayBuffer`, and
 * visa versa. Storing `ArrayBuffers` in IndexedDB is very well supported."
 *
 * @see https://developers.google.com/web/fundamentals/instant-and-offline/web-storage/indexeddb-best-practices
 */
export const blobToBuffer = (blob: Blob) =>
   new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader()

      reader.addEventListener('loadend', () => {
         resolve(reader.result as ArrayBuffer)
      })
      reader.addEventListener('error', reject)
      reader.readAsArrayBuffer(blob)
   })

export function domStringListToArray(domStrings: DOMStringList): string[] {
   const list: string[] = []
   for (let i = 0; i < domStrings.length; i++) {
      list.push(domStrings.item(i)!)
   }
   return list
}
