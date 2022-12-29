import http from '../http-common';

class TransactionsDataService {
    getAll() {
        return http.get('/transactions');
    }
    postTransaction(data) {
        return http.post('/transactions', data);
    }
}

export default new TransactionsDataService();
