import { createServiceToken, makeServiceCallGet } from '../../../microservice_helpers';

/**
 * Interface which wraps functionality of the transaction microservice.
 */
export interface TransactionServiceWrapper {
    getTransactionsByCashbookTimestampsAndType(cashbookId: string, start: Date, end: Date, type: string): Promise<string>;
    getCashbookIdsOfTransactions(): Promise<string[]>;
}


export class TransactionServiceWrapperImpl implements TransactionServiceWrapper {
    transactionServiceUrl: string;

    constructor(transactionServiceUrl: string) {
        this.transactionServiceUrl = transactionServiceUrl;
    }

    async getTransactionsByCashbookTimestampsAndType(cashbookId: string, start: Date, end: Date, type: String): Promise<string> {
        let response = await makeServiceCallGet<any>(
            this.transactionServiceUrl,
            `/api/v1/cashbooks/${cashbookId}/transactions?start=${start}&end=${end}&type=${type}`,
            createServiceToken()
        );
        return response;
    }

    async getCashbookIdsOfTransactions(): Promise<string[]> {
        let response = await makeServiceCallGet<any>(
            this.transactionServiceUrl,
            "/api/v1/cashbooks/cashbookIds",
            createServiceToken()
        );

        return response;
    }
}