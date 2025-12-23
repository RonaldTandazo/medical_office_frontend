<template>
    <v-app>
        <ToolBar pageTitle="Uploads List"></ToolBar>
        <v-container>
            <v-row>
                <v-col cols="12" class="d-flex justify-start">
                    <h2 class="text-h4">Cargas Realizadas</h2>
                </v-col>
            </v-row>
            <v-row>
                <AdaptativeBreadcrumbs :routes="routes"></AdaptativeBreadcrumbs>
            </v-row>

            <div class="d-flex flex-row justify-end align-center mb-3">
                <v-btn
                    prepend-icon="mdi-refresh"
                    color="blue-accent-2"
                    class="me-1"
                    @click="getProviderUploads()"
                >
                    Recargar Información
                </v-btn>
            </div>

            <v-row>
                <v-data-table
                    :loading="loading"
                    loading-text="Cargando Información..."
                    loading-color="accent"
                    :headers="columns"
                    :items="items"
                    class="mt-2 px-4 custom-table"
                >
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-btn
                            color="primary"
                            variant="outlined"
                            size="small"
                            @click="viewDetails(item)"
                        >
                            Ver Detalle
                        </v-btn>
                    </template>
                </v-data-table>
            </v-row>
        </v-container>

        <UploadDetailsModal
            v-model="dialog"
            :upload="selectedUpload"
        />
    </v-app>
</template>

<script>
    import ToolBar from '../../components/General/ToolBar.vue';
    import AdaptativeBreadcrumbs from '../../components/General/AdaptativeBreadcrumbs.vue';
    import UploadDetailsModal from '../../components/Provider/UploadDetailModal.vue';
    import { providerService } from '../../services/providerService';

    export default {
        name: 'ProviderUploads',
        components: {
            ToolBar,
            UploadDetailsModal,
            AdaptativeBreadcrumbs
        },
        data: () => ({
            routes: [
                {
                    title: 'Home',
                    disabled: false,
                    href: '/home'
                },
                {
                    title: 'Dashboard Proveedores',
                    disabled: false,
                    href: '/provider'
                },
                {
                    title: 'Cargas Realizadas',
                    disabled: true,
                    href: '/provider/uploads'
                }
            ],
            columns: [
                { title: "#", key: "index", align: 'center', sortable: false },
                { title: "Proveedor", key: "proveedor", align: 'center', sortable: false },
                { title: "RUC", key: "ruc", align: 'center', sortable: false },
                { title: "Fecha Carga", key: "fecha", align: 'center', sortable: false },
                { title: "Acciones", key: 'actions', align: 'center', sortable: false }
            ],
            loading: false,
            items: [],
            dialog: false,
            selectedUpload: null,
        }),

        mounted() {
            this.getProviderUploads();
        },

        methods: {
            async getProviderUploads(){
                this.loading = true;
                
                try {
                    const response = await providerService.getProviderUploads();
                    if(response.success){
                        this.items = response.data.map((upload, index) => {
                            return {
                                ...upload,
                                index: index + 1,
                                fecha: this.formatDateTime(upload.fecha),
                            }
                        })
                    }
                } catch (error) {
                    console.log("error en cargas del proveedor")
                    console.log(error)
                }finally{
                    this.loading = false;
                }
            },

            formatDateTime(dateString) {
                if (!dateString) return '';

                const date = new Date(dateString);

                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();

                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');

                return `${day}-${month}-${year} ${hours}:${minutes}`;
            },

            viewDetails(item) {
                this.selectedUpload = item;
                this.dialog = true;
            }
        }
    }
</script>

<style scoped>
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
