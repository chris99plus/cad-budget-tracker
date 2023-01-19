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
            headers: { 
                Authorization: `Bearer ${tokenState}`,
                "Content-Type": "multipart/form-data"
            }
        };

        var bodyFormData = new FormData();
        bodyFormData.append("amount", data.amount);
        bodyFormData.append("type", data.type);
        bodyFormData.append("description", data.description);
        bodyFormData.append("comment", data.comment);
        bodyFormData.append("timestamp", data.timestamp);
        bodyFormData.append("category", data.category);
        bodyFormData.append("billImage", data.billImage);

        return http.post('/api/v1/transactions', bodyFormData, config);
    }
    getTotalBalance(tokenState) {
        const config = {
            headers: { Authorization: `Bearer ${tokenState}` }
        };
        return http.get('/api/v1/cashbook/balance', config);
    }
}

export default new TransactionsDataService();
