<template>
    <v-dialog
        v-model="model"
        max-width="1750px"
        persistent
    >
        <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
                <span class="text-h6">Detalles de la Carga</span>
                <v-btn icon="mdi-close" variant="text" @click="close"></v-btn>
            </v-card-title>

            <v-divider />

            <v-card-text>
                <v-data-table
                    :headers="columns"
                    :items="upload.details"
                    class="custom-table"
                    density="compact"
                >
                    <template v-slot:[`item.index`]="{ index }">
                        {{ index + 1 }}
                    </template>

                    <template v-slot:[`item.precio`]="{ item }">
                        $ {{ Number(item.precio).toFixed(2) }}
                    </template>

                    <template v-slot:[`item.total`]="{ item }">
                        $ {{ Number(item.total).toFixed(2) }}
                    </template>
                </v-data-table>
            </v-card-text>

            <v-divider />

            <v-card-actions class="justify-end">
                <v-btn color="primary" variant="outlined" @click="close">
                    Cerrar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'UploadDetailsModal',

    props: {
        modelValue: {
            type: Boolean,
            required: true
        },
        upload: {
            type: Object,
            default: () => ({})
        }
    },

    emits: ['update:modelValue'],

    computed: {
        model: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit('update:modelValue', value);
            }
        }
    },

    data() {
        return {
            columns: [
                { title: "#", key: "index", align: 'center', sortable: false },
                { title: 'Medicamento', key: 'medicamento', align: 'center', sortable: false },
                { title: 'Descripción', key: 'descripcion', align: 'center', sortable: false },
                { title: 'Presentación', key: 'presentacion', align: 'center', sortable: false },
                { title: 'Cantidad', key: 'cantidad', align: 'center', sortable: false },
                { title: 'Precio', key: 'precio', align: 'center', sortable: false },
                { title: 'Total', key: 'total', align: 'center', sortable: false },
                { title: 'Lote', key: 'lote', align: 'center', sortable: false },
                { title: 'Elaboración', key: 'elaboracion', align: 'center', sortable: false },
                { title: 'Caducidad', key: 'caducidad', align: 'center', sortable: false },
                { title: 'Registro Sanitario', key: 'sanitario', align: 'center', sortable: false }
            ]
        };
    },

    methods: {
        close() {
            this.model = false;
        }
    }
};
</script>

<style scoped>
    .custom-table:deep(thead) {
        background-color: #448AFF;
    }

    .custom-table:deep(thead th) {
        color: white;
        font-weight: bold;
    }
</style>
