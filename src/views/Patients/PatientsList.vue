<template>
    <v-app>
        <ToolBar pageTitle="Patients List"></ToolBar>
        <v-container>
            <v-row>
                <v-col cols="12" class="d-flex justify-start">
                    <h2 class="text-h4">Patients List</h2>
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
                                <v-col cols="3">
                                    <v-text-field
                                        v-model="identification"
                                        density="compact"
                                        label="Identification"
                                        clearable
                                        variant="outlined"
                                        prepend-inner-icon="mdi-card-account-details"
                                    >    
                                    </v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field
                                        v-model="patient"
                                        density="compact"
                                        label="Patient"
                                        clearable
                                        variant="outlined"
                                        prepend-inner-icon="mdi-account-injury"
                                    >    
                                    </v-text-field>
                                </v-col>
                                <v-col cols="3">
                                    <v-select
                                        v-model="gender"
                                        clearable
                                        :items="genders"
                                        item-title="label"
                                        item-value="value"
                                        label="Gender"
                                        variant="outlined"
                                        density="compact"
                                        prepend-inner-icon="mdi-gender-male"
                                    ></v-select>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="6" class="d-flex justify-start">
                                    <v-btn
                                        prepend-icon="mdi-account-plus"
                                        color="white"
                                        class="me-2"
                                        ref="modalBtn"
                                        @click="isModalOpen = true; state='new'"
                                    >
                                        New Patient
                                    </v-btn>
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="6" class="d-flex justify-end">
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
                                        @click="getPatientsByDoctor({page: 1, itemsPerPage})"
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
                <v-card class="pa-md-3 elevation-1" width="100%">
                    <div class="table-container">
                        <v-data-table-server
                            v-model:items-per-page="itemsPerPage"
                            :headers="columns"
                            :items="patients"
                            :items-length="totalItems"
                            :loading="loading"
                            loading-text="Loading Records...Please wait"
                            :search="search"
                            item-value="patient_id"
                            @update:options="getDoctorPatients"
                            fixed-header
                        >
                            <template v-slot:item="{ item }">
                                <tr>
                                    <td class="text-center">{{ item.index }}</td>
                                    <td class="text-left">{{ item.name + " "+ item.lastname }}</td>
                                    <td class="text-left">{{ item.identification }}</td>
                                    <td class="text-right">{{ item.age }}</td>
                                    <td class="text-right">{{ item.weight }}</td>
                                    <td class="text-right">{{ item.height }}</td>
                                    <td class="text-left">{{ item.gender == 'M' ? 'Male':(item.gender == 'F' ? 'Female':null) }}</td>
                                    <td class="text-left">{{ item.phone }}</td>
                                    <td class="text-left">{{ item.direction }}</td>
                                    <td class="text-left">{{ item.email }}</td>
                                    <td class="text-center">
                                        <v-menu>
                                            <template v-slot:activator="{ props }">
                                                <v-btn
                                                    v-bind="props"
                                                    density="compact"
                                                    icon="mdi-menu"
                                                    variant="solo"
                                                    :disabled="loading"
                                                >
                                                </v-btn>
                                            </template>
                                      
                                            <v-list>
                                                <v-list-item>
                                                    <v-list-item-title>
                                                        <v-btn
                                                            density="compact"
                                                            icon="mdi-text-box-edit"
                                                            variant="solo"
                                                            @click="isModalOpen = true; state = 'edit'; record=item"
                                                        >
                                                        </v-btn>
                                                        <v-tooltip
                                                            activator="parent"
                                                            location="top"
                                                        >Edit Information</v-tooltip>
                                                    </v-list-item-title>
                                                    <v-divider class="my-2"></v-divider>
                                                    <v-list-item-title>
                                                        <v-btn
                                                            density="compact"
                                                            icon="mdi-receipt-text-arrow-right"
                                                            variant="solo"
                                                            @click="navigateTo('/patients/generate_recipe')"
                                                        >
                                                        </v-btn>
                                                        <v-tooltip
                                                            activator="parent"
                                                            location="top"
                                                        >Generate Recipe</v-tooltip>
                                                    </v-list-item-title>
                                                    <v-divider class="my-2"></v-divider>
                                                    <v-list-item-title>
                                                        <v-btn
                                                            density="compact"
                                                            icon="mdi-link-off"
                                                            variant="solo"
                                                            @click="openDialog(item)" 
                                                        >
                                                        </v-btn>
                                                        <v-tooltip
                                                            activator="parent"
                                                            location="top"
                                                        >Unlink Patient</v-tooltip>
                                                    </v-list-item-title>
                                                </v-list-item>
                                            </v-list>
                                        </v-menu>
                                    </td>
                                </tr>
                            </template>
                        </v-data-table-server>

                    </div>
                </v-card>
            </v-row>
        </v-container>

        <PatientModal v-model="isModalOpen" @close="isModalOpen = false" @save="savePatientInformation" :isModalOpen="isModalOpen" :state="state" :genders="genders" :record="record"/>
        
        <v-dialog v-model="dialogInactivate" max-width="500px">
            <v-card>
                <v-card-title class="text-h6">Are you sure to unlink this patient?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="closeDialog">Cancel</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="unlinkPatient">OK</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <NotificationAlert :info="notificationMessage" v-if="showNotification" />
    </v-app>
</template>

<script>
    import ToolBar from '../../components/General/ToolBar.vue';
    import AdaptativeBreadcrumbs from '../../components/General/AdaptativeBreadcrumbs.vue';
    import PatientModal from '../../components/Patients/PatientModal.vue';
    import NotificationAlert from '../../components/General/NotificationAlert.vue';
    import { patientsService } from "../../services/patientsService";
    import { doctorService } from "../../services/doctorService";
    import { mapGetters } from 'vuex';

    export default {
        name: 'PatientsList',
        components: {
            ToolBar,
            AdaptativeBreadcrumbs,
            PatientModal,
            NotificationAlert
        },
        data: () => ({
            dialogInactivate: false,
            userInfo: null,
            record: null,
            state: 'new',
            isModalOpen: false,
            itemsPerPage: 5,
            routes: [
                {
                    title: 'Home',
                    disabled: false,
                    href: '/home'
                },
                {
                    title: 'Patients Dashboard',
                    disabled: false,
                    href: '/patients'
                },
                {
                    title: 'Patients List',
                    disabled: true,
                    href: '/patients/list'
                }
            ],
            columns: [
                {title: "#", key: "index", align: 'center', sortable: false, width:"100px"},
                {title: "Patient", key: "patient", align: 'center', sortable: false, width:"400px"},
                {title: "Identification", key: 'identification', align: 'center', sortable: false, width:"200px"},
                {title: "Age", key: 'age', align: 'center', sortable: false, width:"125px"},
                {title: "Weight (Kg)", key: 'weight', align: 'center', sortable: false, width:"125px"},
                {title: "Height (m)", key: 'height', align: 'center', sortable: false, width:"125px"},
                {title: "Gender", key: 'gender', align: 'center', sortable: false, width:"125px"},
                {title: "Phone Number", key: 'phone', align: 'center', sortable: false, width:"150px"},
                {title: "Direction", key: 'direction', align: 'center', sortable: false, width:"200px"},
                {title: "E-Mail", key: 'email', align: 'center', sortable: false, width:"200px"},
                {title: "Actions", key: 'actions', align: 'center', sortable: false, width:"125px"}
            ],
            genders: [
                { label: 'Male', value: 'M' },
                { label: 'Female', value: 'F' },
            ],
            gender: null,
            patient: null,
            identification: null,
            loading: false,
            patients: [],
            totalItems: 0,
            search: '',
            showNotification: false,
            notificationMessage: {},
            item: null
        }),

        watch: {
            dialogInactivate (val) {
                val || this.closeDialog()
            },
        },

        computed: {
            ...mapGetters('auth', ['getUserData']),
        },

        mounted() {
            this.userInfo = this.getUserData,
            this.getPatientsByDoctor({ page: 1, itemsPerPage: this.itemsPerPage });
        },

        methods: {
            async getPatientsByDoctor({ page, itemsPerPage }){
                try {
                    this.loading = true;
                    if(!this.userInfo.doctor_id){
                        this.patients = [];
                        this.loading = false;

                        return null
                    }

                    const search = {
                        identification: this.identification,
                        patient: this.patient,
                        gender: this.gender,
                        doctorId: this.userInfo.doctor_id
                    }

                    const response = await patientsService.getPatientsByDoctor(search, page - 1, itemsPerPage);
                    if (!response.success) {
                        this.$emit('notify', {message: response.message, ok: response.success, show: true});
                    } else {
                        this.totalItems = response.data.totalElements;
                        this.patients = response.data.content.map((patient, index) => ({
                            index: index + 1,
                            patient: patient.name + ' ' + patient.lastname,
                            ...patient
                        }));
                    }
                } catch (error) {
                    this.$emit('notify', {message: "Error While Searching", ok: false, show: true});
                } finally {
                    this.loading = false;
                } 
            },
            cleanFilters(){
                this.patient = null
                this.gender = null
                this.identification = null
            },
            closeModal() {
                this.isModalOpen = false;
            },
            async savePatientInformation(data) {
                try{
                    if(data.patient != null){
                        const patient = data.patient
                        let response = null
                        const found_patient = this.patients.find(p => p.identification === patient.identification);

                        if(data.state == "new"){
                            if(found_patient){
                                return null
                            }

                            this.patients.push({
                                index: this.patients.length + 1,
                                patient_id: patient.patient_id,
                                name: patient.name,
                                lastname: patient.lastname,
                                identification: patient.identification,
                                age: patient.age,
                                weight: patient.weight,
                                height: patient.height,
                                gender: patient.gender,
                                phone: patient.phone,
                                direction: patient.direction,
                                email: patient.email,
                            });
                            this.totalItems += 1 

                            response = await patientsService.store(patient, this.userInfo.doctor_id)
                        }else{
                            if (found_patient) {
                                found_patient.patient_id = patient.patientId,
                                found_patient.name = patient.name,
                                found_patient.lastname = patient.lastname,
                                found_patient.identification = patient.identification,
                                found_patient.age = patient.age,
                                found_patient.weight = patient.weight,
                                found_patient.height = patient.height,
                                found_patient.gender = patient.gender,
                                found_patient.phone = patient.phone,
                                found_patient.direction = patient.direction,
                                found_patient.email = patient.email,
                                found_patient.doctorId = this.userInfo.user_id
                               
                                response = await patientsService.update(found_patient.patient_id, found_patient)
                            }
                        }

                        this.notificationMessage = {
                            message: response.message, 
                            ok: true, 
                            show: true
                        }
                    }
                }catch (error) {
                    this.notificationMessage = {
                        message:error.response.data.message, 
                        ok:false, 
                        show: true
                    }
                } finally {
                    if(this.notificationMessage.show){
                        this.triggerNotification()
                    }
                }
            },
            triggerNotification() {
                this.showNotification = true;
                setTimeout(() => {
                    this.showNotification = false;
                }, 3000);
            },
            openDialog(item) {
                this.item = item
                this.dialogInactivate = true
            },
            closeDialog() {
                this.dialogInactivate = false
            },
            async unlinkPatient() {
                this.loading = true
                this.closeDialog()
                try{
                    const data = {
                        doctor_id: this.userInfo.doctor_id,
                        patient_id: this.item.patientId
                    }

                    const response = await doctorService.unlikPatient(data)

                    this.notificationMessage = {
                        message:response.message, 
                        ok:true, 
                        show: true
                    }
                }catch(error){
                    this.notificationMessage = {
                        message:error.response.data.message, 
                        ok:false, 
                        show: true
                    }
                }finally{
                    this.loading = false
                    this.getPatientsByDoctor({page: 1, itemsPerPage: this.itemsPerPage})
                    this.triggerNotification()
                }
            },
            navigateTo(route){
                this.$router.push(route)
            }
        }
    }
</script>

<style scoped>
    .table-container {
        max-height: 400px;
        overflow-y: auto;
        overflow-x: auto;
        white-space: nowrap;
    }
</style>
