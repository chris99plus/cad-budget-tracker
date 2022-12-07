import http from '../http-common';

class TransactionsDataService {
    getAll() {
        return http.get();
    }
}

export default new TransactionsDataService();
