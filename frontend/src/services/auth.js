import http from '../http-common';

class AuthService {
    createUser(data) {
        return http.post('/auth/users', data);
    }
}

export default new AuthService();
