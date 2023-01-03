import http from '../http-common';

class TransactionsDataService {
    getAll() {
        return http.get('/api/v1/transactions');
    }
    postTransaction(data) {
        return http.post('/api/v1/transactions', data);
    }
}

export default new TransactionsDataService();
