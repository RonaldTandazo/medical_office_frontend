import axios from './axios';

const API_URL = process.env.VUE_APP_URL || 'http://localhost:8081/api';

export const patientsService = {
    async getPatientsByDoctor(data, page, size){
        const response = await axios.get(`${API_URL}/patients/patients_by_doctor`, {params: { 
            ...data,
            page: page, 
            size: size 
        }})
        return response
    },

    async store(data, doctor_id){
        const response = await axios.post(`${API_URL}/patients/store?doctor_id=${doctor_id}`, data)
        return response
    },

    async update(patient_id, data){
        const response = await axios.put(`${API_URL}/patients/update/${patient_id}`, data)
        return response
    }
};