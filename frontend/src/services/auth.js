import http from '../http-common';

class AuthService {
    createUser(data) {
        return http.post('/api/v1/auth/users', data);
    }
    login(data) {
        return http.post('/api/v1/auth/login', data);
    }
    getUserInformation(tokenState) {
        const config = {
            headers: { Authorization: `Bearer ${tokenState}` }
        };
        return http.get('/api/v1/auth/me', config);
    }
}

export default new AuthService();
