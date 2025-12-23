<template>
    <v-app>
        <ToolBar pageTitle="Medications List"></ToolBar>
        <v-container>
            <v-row>
                <v-col cols="12" class="d-flex justify-start">
                    <h2 class="text-h4">Medications List</h2>
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
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="medication"
                                        density="compact"
                                        label="Medication"
                                        clearable
                                        variant="outlined"
                                        prepend-inner-icon="mdi-pill"
                                    >    
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="6" class="d-flex justify-start">
                                    <v-btn
                                        prepend-icon="mdi-medication"
                                        color="white"
                                        class="me-2"
                                        ref="modalBtn"
                                        @click="isModalOpen = true; state='new'"
                                    >
                                        New Medication
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
                                        @click="getAllMedications({page: 1, itemsPerPage})"
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
                            :items="medications"
                            :items-length="totalItems"
                            item-value="medication_id"
                            :loading="loading"
                            loading-text="Loading Records...Please wait"
                            fixed-header
                            show-expand
                        >
                            <template v-slot:[`item.diseases`]="{ item }">
                                <div class="d-flex flex-wrap justify-center">
                                    <template v-for="(disease, index) in item.diseases" :key="index">
                                        <v-chip class="mx-1 my-1" color="green">
                                            {{ disease }}
                                        </v-chip>
                                    </template>
                                </div>
                            </template>
                            <template v-slot:expanded-row="{ columns, item }">
                                <tr>
                                    <td :colspan="columns.length">
                                        <div class="d-flex justify-center">
                                            <v-tabs v-model="selectedLab" color="primary" direction="vertical" style="padding-top:15px;">
                                                <v-tab
                                                    v-for="(lab) in item.laboratories"
                                                    :key="lab.laboratory_id"
                                                    :value="lab.laboratory_id"
                                                    prepend-icon="mdi-chemical-weapon"
                                                    :text="lab.laboratory"
                                                >
                                                </v-tab>
                                            </v-tabs>

                                            <v-tabs-window v-model="selectedLab" class="flex-grow-1">
                                                <v-tabs-window-item
                                                    v-for="(lab) in item.laboratories"
                                                    :key="lab.laboratory_id"
                                                    :value="lab.laboratory_id"
                                                >
                                                    <v-card style="margin-top: 10px; margin-bottom: 10px; margin-left: 10px;">
                                                        <v-data-table-virtual
                                                            :headers="nestedColumns"
                                                            :items="lab.content"
                                                            item-value="medication_laboratory_id"
                                                            fixed-header
                                                        >
                                                        </v-data-table-virtual>
                                                    </v-card>
                                                </v-tabs-window-item>
                                            </v-tabs-window>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </v-data-table-server>

                    </div>
                </v-card>
            </v-row>
        </v-container>

        <MedicationModal v-model="isModalOpen" @close="isModalOpen = false" :isModalOpen="isModalOpen" :state="state" :record="record" @save="saveMedication"/>
    </v-app>
</template>

<script>
    import ToolBar from '../../components/General/ToolBar.vue';
    import AdaptativeBreadcrumbs from '../../components/General/AdaptativeBreadcrumbs.vue';
    import MedicationModal from '../../components/Medications/MedicationModal.vue';
    import { medicationService } from '@/services/medicationService';

    export default {
        name: 'MedicationsList',
        components: {
            ToolBar,
            AdaptativeBreadcrumbs,
            MedicationModal
        },
        data: () => ({
            record: null,
            selectedLab: 0,
            medication: null,
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
                    title: 'Medications Dashboard',
                    disabled: false,
                    href: '/medications'
                },
                {
                    title: 'Medications List',
                    disabled: true,
                    href: '/medications/list'
                }
            ],
            columns: [
                {title: '', key: 'data-table-expand' },
                {title: "#", key: 'index', align: 'center', sortable: false, width:"100px"},
                {title: "Medication", key: "medication", align: 'center', sortable: false, width:"300px"},
                {title: "Type", key: 'type', align: 'center', sortable: false, width:"300px"},
                {title: "Diseases", key: 'diseases', align: 'center', sortable: false, width:"600px"}
            ],
            nestedColumns: [
                { title: "#", key: "index", align: "center", sortable: false },
                { title: "Grams", key: "grams", align: "center", sortable: false },
                { title: "Price", key: "price", align: "center", sortable: false },
                { title: "Unit", key: "unit", align: "center", sortable: false },
            ],
            loading: true,
            medications: [],
            totalItems: 0,
            search: '',
        }),

        mounted() {
            this.getAllMedications({ page: 1, itemsPerPage: this.itemsPerPage });
        },

        methods: {
            async getAllMedications({ page, itemsPerPage }){
                try {
                    this.loading = true
                    const search = {
                        medication: this.medication,
                    }

                    const response = await medicationService.getAllMedications(search, page - 1, itemsPerPage);
                    if (!response.success) {
                        this.$emit('notify', {message: response.message, ok: response.success, show: true});
                    } else {
                        this.totalItems = response.data.pagination.totalElements;
                        this.medications = response.data.medications.map((medication, index) => {
                            return {
                                index: index + 1,
                                medication_id: medication.medication_id,
                                medication: medication.medication,
                                type: medication.type,
                                diseases: medication.diseases,
                                laboratories: medication.laboratories.map((laboratory) => {
                                    return{
                                        laboratory_id: laboratory.laboratory_id,
                                        laboratory: laboratory.laboratory,
                                        content: laboratory.content.map((info, index_info) => {
                                            return{
                                                index: index_info + 1,
                                                medication_laboratory_id: info.medication_laboratory_id,
                                                grams: info.grams,
                                                price: info.price,
                                                unit: info.unit
                                            }
                                        })
                                    }
                                })
                            }
                        });
                    }
                } catch (error) {
                    this.$emit('notify', {message: "Error While Searching", ok: false, show: true});
                } finally {
                    this.loading = false;
                }
            },
            cleanFilters(){
                this.medication = null
            },
            async saveMedication(data) {
                try{
                    if(data.medication != null){
                        const medication = data.medication
                        // let response = null
                        const found_medication = this.medications.find(m => m.medication_id === medication.medication_id);

                        if(data.state == "new"){
                            if(found_medication){
                                return null
                            }

                            this.medications.push({
                                index: this.medications.length + 1,
                                medication_id: null,
                                medication: medication.medication,
                                type: medication.type.label,
                                diseases: medication.diseases.map((d) => d.label),
                                laboratories: [{
                                    laboratory_id: medication.laboratory.value,
                                    laboratory: medication.laboratory.label,
                                    content: [{
                                        index: 1,
                                        medication_laboratory_id: null,
                                        grams: medication.grams,
                                        price: medication.price,
                                        unit: medication.unit.label
                                    }]
                                }]
                            });
                            this.totalItems += 1 
                        }else{
                            console.log(found_medication)
                        }

                        // this.notificationMessage = {
                        //     message: response.message, 
                        //     ok: true, 
                        //     show: true
                        // }
                    }
                }catch (error) {
                    // this.notificationMessage = {
                    //     message:error.response.data.message, 
                    //     ok:false, 
                    //     show: true
                    // }
                    console.log(error)
                } finally {
                    if(this.notificationMessage && this.notificationMessage.show){
                        this.triggerNotification()
                    }
                }
            },
        }
    }
</script>

<style scoped>
    .table-container {
        max-height: 1000px;
        overflow-y: auto;
        overflow-x: auto;
        white-space: nowrap;
    }
</style>
