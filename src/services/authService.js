import axios from './axios';

const API_URL = process.env.VUE_APP_URL || 'http://localhost:8081/api';

export const authService = {
    async verifyEmail(data){
        const response = await axios.post(`${API_URL}/auth/verify_email`, data)
        return response
    },

    async registerUser(userData) {
        const response = await axios.post(`${API_URL}/auth/signup`, userData);
        return response;
    },

    async loginUser(userData) {
        const response = await axios.post(`${API_URL}/auth/login`, userData);
        return response;
    },
    
    async sendRecoverEmail(userData){
        const response = await axios.post(`${API_URL}/auth/send_recover_email`, userData)
        return response
    },

    async resetPassword(token, data){
        const response = await axios.put(`${API_URL}/auth/reset_password`, data, {params: { token: token }})
        return response
    }
};
