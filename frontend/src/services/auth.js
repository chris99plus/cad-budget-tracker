import http from '../http-common';

class AuthService {
    createUser(data) {
        return http.post('/api/v1/auth/users', data);
    }
    login(data) {
        return http.post('/api/v1/auth/login', data);
    }
}

export default new AuthService();
