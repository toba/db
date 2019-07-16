import { is } from '@toba/tools';
/**
 * Idempotent index name used to store and look-up the index in the data
 * provider.
 */
export const indexName = (index) => is.array(index.field)
    ? index.field.sort().join('-')
    : index.field;
