import Axios from 'axios';

Axios.defaults.baseURL = '';

export default Axios.create({
    baseURL: '',
    headers: {
        'Content-type': 'application/json'
    }
});
