import http from '../http-common';

class TransactionsDataService {
    getAll(tokenState) {
        const config = {
            headers: { Authorization: `Bearer ${tokenState}` }
        };
        return http.get('/api/v1/transactions', config);
    }
    postTransaction(data, tokenState) {
        const config = {
            headers: { Authorization: `Bearer ${tokenState}` }
        };
        return http.post('/api/v1/transactions', data, config);
    }
    getTotalBalance(tokenState) {
        const config = {
            headers: { Authorization: `Bearer ${tokenState}` }
        };
        return http.get('/api/v1/cashbook/balance', config);
    }
}

export default new TransactionsDataService();
