<template>
    <v-app>
        <ToolBar pageTitle="Schedule Appoinment"></ToolBar>
        <v-container>
            <v-row>
                <v-col cols="12" class="d-flex justify-start">
                    <h2 class="text-h4">Schedule Appoinment</h2>
                </v-col>
            </v-row>
            <v-row>
                <AdaptativeBreadcrumbs :routes="routes"></AdaptativeBreadcrumbs>
            </v-row>
            <v-row>
                <v-expansion-panels variant="accordion">
                    <v-expansion-panel title="Search Filters">
                        <v-expansion-panel-text>
                            <v-row cols="12">
                                <v-col cols="6">
                                    <v-select
                                        v-model="speciality"
                                        clearable
                                        :items="specialities"
                                        item-title="label"
                                        item-value="value"
                                        label="Specialities"
                                        variant="outlined"
                                        density="compact"
                                        prepend-inner-icon="mdi-group"
                                        @update:model-value="getDoctorsBySpeciality"
                                    ></v-select>
                                </v-col>
                                <v-col cols="6">
                                    <v-select
                                        v-model="doctor"
                                        clearable
                                        :items="doctors"
                                        item-title="label"
                                        item-value="value"
                                        label="Doctor"
                                        variant="outlined"
                                        density="compact"
                                        prepend-inner-icon="mdi-doctor"
                                    ></v-select>
                                </v-col>
                            </v-row>
                            <v-row cols="12">
                                <v-col cols="6">
                                    <v-select
                                        v-model="month"
                                        clearable
                                        :items="months"
                                        item-title="label"
                                        item-value="value"
                                        label="Month"
                                        variant="outlined"
                                        density="compact"
                                        prepend-inner-icon="mdi-calendar-month"
                                    ></v-select>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field
                                        v-model="year"
                                        density="compact"
                                        label="Year"
                                        clearable
                                        variant="outlined"
                                        prepend-inner-icon="mdi-calendar-month"
                                    >    
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-row cols="12">
                                <v-col class="d-flex justify-end">
                                    <v-btn
                                        prepend-icon="mdi-eraser"
                                        color="black"
                                        class="me-2"
                                        @click="cleanFilters"
                                    >
                                        Clear
                                    </v-btn>
                                    <v-btn
                                        prepend-icon="mdi-cloud-search"
                                        color="blue-accent-2"
                                        @click="getDoctorPatients({page: 1, itemsPerPage})"
                                    >
                                        Search
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-row>
            <v-row class="py-md-5">
                <v-divider></v-divider>
            </v-row>
            <v-row>
                <CustomCalendar style="width: 100%;" :specialities="specialities" :userInfo="userInfo"/>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
import ToolBar from '../../components/General/ToolBar.vue';
import AdaptativeBreadcrumbs from '../../components/General/AdaptativeBreadcrumbs.vue';
import CustomCalendar from '../../components/General/CustomCalendar.vue';
import { specialityService } from "../../services/specialityService"
import { doctorService } from "../../services/doctorService"
import { mapGetters } from "vuex"

export default {
    name: 'ScheduleAppoinment',
    components: {
        ToolBar,
        AdaptativeBreadcrumbs,
        CustomCalendar
    },
    data: () => ({
        userInfo: null,
        routes: [
            {
                title: 'Dashboard',
                disabled: false,
                href: '/home'
            },
            {
                title: 'Patients Dashboard',
                disabled: false,
                href: '/patients'
            },
            {
                title: 'Schedule Appoinment',
                disabled: true,
                href: '/patients/schedule_appoinment'
            }
        ],
        specialities: [],
        doctors: [],
        speciality: null,
        doctor: null,
        month: null,
        year: null
    }),

    computed: {
        ...mapGetters('auth', ['getUserData']),
    },

    mounted() {
        this.userInfo = this.getUserData,
        this.getAllSpecialities();
    },

    methods: {
        async getAllSpecialities(){
            try {
                const response = await specialityService.getAllSpecialities();
                if (!response.success) {
                    this.$emit('notify', {message: response.message, ok: response.success, show: true});
                } else {
                    this.totalItems = response.data.totalElements;
                    this.specialities = response.data.map(speciality => ({
                        value: speciality.id,
                        label: speciality.description
                    }));
                }
            } catch (error) {
                this.$emit('notify', {message: "Error While Searching", ok: false, show: true});
            }
        },
        
        async getDoctorsBySpeciality(){
            try{
                this.doctor = null
                const response = await doctorService.getDoctorsBySpeciality(this.speciality);
                if (!response.success) {
                    this.$emit('notify', {message: response.message, ok: response.success, show: true});
                } else {
                    this.totalItems = response.data.totalElements;
                    this.doctors = response.data.map(doctor => ({
                        value: doctor.id,
                        label: doctor.nombre
                    }));
                }
            }catch(error){
                this.$emit('notify', {message: "Error While Searching", ok: false, show: true});
            }
        },

        cleanFilters(){
            this.speciality = []
            this.doctor = []
            this.month = null
            this.year = null
        },
    }
};
</script>