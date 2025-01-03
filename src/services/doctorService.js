import axios from './axios';

const API_URL = process.env.VUE_APP_URL || 'http://localhost:8081/api';

export const doctorService = {
    async getDoctorsBySpeciality(speciality_id){
        const response = await axios.get(`${API_URL}/doctors/doctors_by_speciality`, {params: { speciality_id }})
        return response
    },

    async unlikPatient(data){
        const response = await axios.put(`${API_URL}/doctors/unlink_patient/${data.patient_id}/${data.doctor_id}`)
        return response
    }
};