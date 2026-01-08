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
                <v-btn color="success" variant="outlined" @click="exportToExcel">
                    Descargar Excel
                </v-btn>

                <v-btn color="primary" variant="outlined" @click="close">
                    Cerrar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import * as XLSX from 'xlsx-js-style';

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
                    { title: 'Fecha Elaboración', key: 'elaboracion', align: 'center', sortable: false },
                    { title: 'Fecha Caducidad', key: 'caducidad', align: 'center', sortable: false },
                    { title: 'Registro Sanitario', key: 'sanitario', align: 'center', sortable: false }
                ]
            };
        },

        methods: {
            close() {
                this.model = false;
            },

            exportToExcel() {
                if (!this.upload.details || !this.upload.details.length) return;

                const data = this.upload.details.map((item, index) => ({
                    '#': index + 1,
                    'Medicamento': item.medicamento,
                    'Descripción': item.descripcion,
                    'Presentación': item.presentacion,
                    'Cantidad': item.cantidad,
                    'Precio': Number(item.precio),
                    'Total': Number(item.total),
                    'Lote': item.lote,
                    'Fecha Elaboración': item.elaboracion,
                    'Fecha Caducidad': item.caducidad,
                    'Registro Sanitario': item.sanitario
                }));

                const worksheet = XLSX.utils.json_to_sheet(data);
                const range = XLSX.utils.decode_range(worksheet['!ref']);

                for (let C = range.s.c; C <= range.e.c; ++C) {
                    const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: C })];
                    if (!cell) continue;

                    cell.s = {
                        fill: { fgColor: { rgb: '000000' } },
                        font: { bold: true, color: { rgb: 'FFFFFF' } },
                        alignment: { horizontal: 'center', vertical: 'center' }
                    };
                }

                for (let R = 1; R <= range.e.r; ++R) {
                    for (let C = range.s.c; C <= range.e.c; ++C) {
                        const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
                        if (!cell) continue;

                        cell.s = {
                            ...(cell.s || {}),
                            alignment: { horizontal: 'center', vertical: 'center' }
                        };
                    }
                }

                const headers = Object.keys(data[0]);
                const precioCol = headers.indexOf('Precio');
                const totalCol = headers.indexOf('Total');

                for (let R = 1; R <= range.e.r; ++R) {
                    [precioCol, totalCol].forEach(col => {
                        const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: col })];
                        if (!cell) return;

                        cell.t = 'n';
                        cell.z = '"$"#,##0.00';
                    });
                }

                worksheet['!cols'] = [
                    { wch: 5 },
                    { wch: 25 },
                    { wch: 30 },
                    { wch: 20 },
                    { wch: 10 },
                    { wch: 12 },
                    { wch: 12 },
                    { wch: 15 },
                    { wch: 15 },
                    { wch: 15 },
                    { wch: 25 }
                ];

                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Detalle Carga');

                XLSX.writeFile(workbook, 'detalle_carga.xlsx');
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
