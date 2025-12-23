<template>
    <v-app>
        <ToolBar></ToolBar>

        <v-container>
            <!-- LOADING -->
            <v-row
                v-if="loading"
                class="content"
                align="center"
                justify="center"
            >
                <v-progress-circular
                    indeterminate
                    color="primary"
                    size="64"
                />
            </v-row>

            <!-- DASHBOARD CARDS -->
            <template v-else>
                <v-row>
                    <!-- Total Cargas -->
                    <v-col cols="12" md="3">
                        <v-card elevation="3">
                            <v-card-title class="text-subtitle-1">
                                Cargas de Proveedores
                            </v-card-title>
    
                            <v-card-text class="text-h4 font-weight-bold">
                                {{ info?.totalUploads ?? 0 }}
                            </v-card-text>
                        </v-card>
                    </v-col>
    
                    <!-- Total Medicamentos -->
                    <v-col cols="12" md="3">
                        <v-card elevation="3">
                            <v-card-title class="text-subtitle-1">
                                Total Medicamentos
                            </v-card-title>
    
                            <v-card-text class="text-h4 font-weight-bold">
                                {{ info?.totalMedications ?? 0 }}
                            </v-card-text>
                        </v-card>
                    </v-col>
    
                    <!-- Total Inventario -->
                    <v-col cols="12" md="3">
                        <v-card elevation="3">
                            <v-card-title class="text-subtitle-1">
                                Total Inventario
                            </v-card-title>
    
                            <v-card-text class="text-h4 font-weight-bold">
                                {{ info?.totalInvMedications ?? 0 }}
                            </v-card-text>
                        </v-card>
                    </v-col>
    
                    <!-- Total Dinero -->
                    <v-col cols="12" md="3">
                        <v-card elevation="3">
                            <v-card-title class="text-subtitle-1">
                                Total Comprado ($ USD)
                            </v-card-title>
    
                            <v-card-text class="text-h4 font-weight-bold">
                                {{ formatCurrency(info?.totalUploadsCurrency) }}
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <v-row class="mt-6">
                    <v-col cols="12" md="6">
                        <BarChart
                            title="Cargas por Mes"
                            :labels="monthLabels"
                            :data="uploadsByMonthData"
                        />
                    </v-col>

                    <v-col cols="12" md="6">
                        <BarChart
                            title="Monto Total por Mes ($ USD)"
                            :labels="monthLabels"
                            :data="amountByMonthData"
                        />
                    </v-col>
                </v-row>

                <v-row class="mt-6">
                    <v-col cols="12">
                        <div class="d-flex flex-row justify-start align-center mb-2">
                            <v-icon color="red">mdi-alert</v-icon>
                            <h3 class="text-h5 ml-1">Alertas de Inventario</h3>
                        </div>

                        <template v-if="alerts.length > 0">
                            <v-alert
                                type="warning"
                                variant="tonal"
                                border="start"
                                prominent
                                class="my-2"
                            >
                                <div class="d-flex align-center">
                                    <span>
                                        Se debe solicitar Stock de los siguientes medicamentos a los Proveedores
                                    </span>
                                </div>
                            </v-alert>

                            <v-data-table
                                :headers="alertHeaders"
                                :items="alerts"
                                density="compact"
                                class="custom-table"
                                no-data-text="No existen alertas de inventario 🎉"
                            >
                                <template v-slot:[`item.index`]="{ index }">
                                    {{ index + 1 }}
                                </template>

                                <template v-slot:[`item.stock`]="{ item }">
                                    <v-chip
                                        color="red"
                                        variant="flat"
                                        size="small"
                                    >
                                        {{ item.stock }}
                                    </v-chip>
                                </template>
                            </v-data-table>
                        </template>

                        <!-- SIN ALERTAS -->
                        <template v-else>
                            <v-alert
                                type="success"
                                variant="tonal"
                                border="start"
                                prominent
                                class="my-2"
                            >
                                <div class="d-flex align-center">
                                    <span>
                                        No existen alertas de inventario. Todos los medicamentos tienen stock suficiente.
                                    </span>
                                </div>
                            </v-alert>
                        </template>
                    </v-col>
                </v-row>
            </template>
        </v-container>
    </v-app>
</template>

<script>
    import ToolBar from '../components/General/ToolBar.vue';
    import BarChart from '../components/Dashboard/BarChart.vue';
    import { dashboardService } from '@/services/dashboardService';

    export default {
        name: 'DashboardPage',
        components: {
            ToolBar,
            BarChart
        },

        data: () => ({
            loading: false,
            info: null,
            monthLabels: [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ],
            alertHeaders: [
                { title: '#', key: 'index', align: 'center', sortable: false },
                { title: 'Medicamento', key: 'medicamento', align: 'center', sortable: false },
                { title: 'Descripción', key: 'descripcion', align: 'center', sortable: false },
                { title: 'Presentación', key: 'presentacion', align: 'center', sortable: false },
                { title: 'Stock', key: 'stock', align: 'center', sortable: false }
            ],
            alerts: []
        }),

        computed: {
            uploadsByMonthData() {
                if (!this.info) return [];
                return this.info.uploadsByMonth.map(i => i.total);
            },

            amountByMonthData() {
                if (!this.info) return [];
                return this.info.amountByMonth.map(i => i.total);
            }
        },

        mounted(){
            this.getDashboardInfo();
        },

        methods: {
            async getDashboardInfo(){
                this.loading = true;

                try {
                    const response = await dashboardService.getDeshboardInfo();
                    console.log(response)
                    if(response.success){
                        this.info = response.data;
                        this.alerts = this.info.alerts;
                    }
                } catch (error) {
                    console.log("error en dashboard")
                    console.log(error)
                }finally{
                    this.loading = false;
                }
            },

            formatCurrency(value){
                if(!value) return '$0.00';
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                }).format(value);
            }
        }
    }
</script>

<style scoped>
    .content{
        height: 100dvh;
    }

    .custom-table:deep(thead) {
        background-color: #448AFF;
    }

    .custom-table:deep(thead th) {
        color: white;
        font-weight: bold;
        font-size: 15px;
        text-align: center;
    }
</style>
  