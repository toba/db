/**
 * An entity with access to the `DataClient`.
 */
export class StoreEntity {
    constructor(client) {
        this.client = client;
    }
}
