import axios from './axios';

const API_URL = process.env.VUE_APP_URL || 'http://localhost:8081/api';

export const dashboardService = {
    async getDeshboardInfo(){
        const response = await axios.get(`${API_URL}/dashboard/info`);
        return response;
    }
};
