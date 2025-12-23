import axios from './axios';

const API_URL = process.env.VUE_APP_URL || 'http://localhost:8081/api';

export const providerService = {
    async downloadTemplate() {
        const response = await axios.get(
            `${API_URL}/provider/download_template`,
            { responseType: 'blob' }
        );

        return response;
    },

    async uploadMedication(data){
        const response = await axios.post(`${API_URL}/provider/upload_medication`, data);
        return response;
    },

    async getProviderUploads(){
        const response = await axios.get(`${API_URL}/provider/uploads`);
        return response;
    }
};
