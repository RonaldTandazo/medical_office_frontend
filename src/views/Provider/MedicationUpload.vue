<template>
    <v-app>
        <ToolBar :pageTitle="'RecepSync'" :logged="false" />

        <div class="d-flex justify-space-between align-center ma-4">
            <h3 class="text-h4">Carga de Medicamentos</h3>
            <v-btn 
                prepend-icon="mdi-file-download" 
                color="green" 
                variant="elevated" 
                @click="downloadTemplate"
            >
                Descargar Plantilla
            </v-btn>
        </div>

        <!-- Dropzone -->
        <div
            v-if="!file"
            class="dropzone mx-2"
            :class="{ 'dropzone--active': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
        >
            <v-icon size="48" color="green">mdi-file-excel</v-icon>

            <p class="mt-2">
                Arrastra y suelta el archivo Excel aquí
            </p>

            <p class="text-medium-emphasis">o</p>

            <v-btn
                color="green"
                variant="tonal"
                @click="openFileDialog"
            >
                Seleccione Archivo
            </v-btn>

            <!-- Input oculto -->
            <input
                ref="fileInput"
                type="file"
                class="d-none"
                accept=".xls,.xlsx"
                @change="handleFileSelect"
            />

            <!-- Archivo seleccionado -->
            <p v-if="file" class="mt-4 text-success">
                📄 {{ file.name }}
            </p>

            <!-- Error -->
            <p v-if="error" class="mt-2 text-error">
                {{ error }}
            </p>
        </div>

        <div
            class="d-flex flex-column justify-center"
        >
            <div class="d-flex flex-row align-center mx-4 my-2">
                <h4 class="text-h5" v-if="file && fileErrors.length > 0">Inconsistencias en el Archivo</h4>
                <h4 class="text-h5" v-if="file && generalData && medicamentosData.length > 0">Previsualización de Datos</h4>

                <v-spacer />

                <v-btn
                    v-if="file && generalData && medicamentosData.length > 0"
                    @click="saveData()"
                    prepend-icon="mdi-upload" 
                    color="green" 
                    variant="elevated"
                    class="mr-4"
                >
                    Guardar Información
                </v-btn>

                <v-btn
                    v-if="file"
                    @click="resetFile()"
                    prepend-icon="mdi-refresh" 
                    color="green" 
                    variant="elevated"
                >
                    Cargar Archivo
                </v-btn>
            </div>

            <div
                v-if="file && fileErrors.length > 0"
            >
                <v-data-table
                    :headers="errorHeaders"
                    :items="fileErrors"
                    class="mt-2 px-4 custom-table"
                />
            </div>
    
            <div
                v-if="file && generalData && medicamentosData.length > 0"
            >
                <v-tabs
                    v-model="activeTab"
                    fixed-tabs
                    slider-color="green"
                    align-tabs="title"
                >
                    <v-tab
                        v-for="tab in tabs" 
                        :key="tab.value" 
                        :value="tab.value"
                    >
                        {{ tab.title }}
                    </v-tab>
                </v-tabs>
        
                <v-tabs-window v-model="activeTab">
                    <!-- TAB 1: DATOS GENERALES -->
                    <v-tabs-window-item :value="0">
                        <v-data-table
                            :headers="generalHeaders"
                            :items="[generalData]"
                            class="mt-2 px-4 custom-table"
                        >
                        </v-data-table>
                    </v-tabs-window-item>
    
                    <!-- TAB 2: MEDICAMENTOS -->
                    <v-tabs-window-item :value="1">
                        <v-data-table
                            :headers="dataHeaders"
                            :items="medicamentosData"
                            class="mt-2 px-4 custom-table"
                        >
                            <template v-slot:[`item.index`]="{ index }">
                                {{ index + 1 }}
                            </template>

                            <template v-slot:[`item.precio_unitario`]="{ item }">
                                $ {{ Number(item.precio_unitario).toFixed(2) }}
                            </template>
    
                            <template v-slot:[`item.valor_total`]="{ item }">
                                $ {{ Number(item.valor_total).toFixed(2) }}
                            </template>
                        </v-data-table>
                    </v-tabs-window-item>
                </v-tabs-window>
            </div>
        </div>


        <v-overlay
            :model-value="loading"
            class="align-center justify-center"
            persistent
        >
            <v-card class="pa-6 text-center" width="300">
                <v-progress-circular
                    indeterminate
                    color="green"
                    size="48"
                />
                <div class="mt-4 text-h6">{{ message }}</div>
                <div class="text-medium-emphasis">{{ aux }}</div>
            </v-card>
        </v-overlay>

        <v-slide-x-reverse-transition>
            <NotificacionAlert :info="notificationMessage" />
        </v-slide-x-reverse-transition>
    </v-app>
</template>

<script>
    import * as XLSX from 'xlsx';
    import ToolBar from '../../components/General/ToolBar.vue';
    import { providerService } from '../../services/providerService';
    import NotificacionAlert from "../../components/General/NotificationAlert.vue";

    export default {
        components: { ToolBar, NotificacionAlert },
        data() {
            return {
                file: null,
                error: null,
                isDragging: false,
                fileErrors: [],
                requiredFields: [
                    { title: '#', key: 'index' },
                    { title: 'Medicamento', key: 'medicamento' },
                    { title: 'Descripción', key: 'descripcion' },
                    { title: 'Presentación', key: 'presentacion' },
                    { title: 'Cantidad', key: 'cantidad' },
                    { title: 'Lote', key: 'lote' },
                    { title: 'Fecha Elaboración', key: 'fecha_elaboracion' },
                    { title: 'Fecha Caducidad', key: 'fecha_caducidad' },
                    { title: 'Registro Sanitario', key: 'registro_sanitario' },
                    { title: 'Precio Unitario', key: 'precio_unitario' },
                    { title: 'Valor Total', key: 'valor_total' }
                ],
                generalFields: [
                    { title: 'RUC', key: 'ruc' },
                    { title: 'Proveedor', key: 'proveedor' },
                ],
                loading: false,
                message: '',
                aux: 'Espere un Momento',
                notificationMessage: {message: '', ok: false, show: false},
                errorHeaders: [
                    {title: 'Hoja', key: 'hoja', align: 'center', sortable: false},
                    {title: 'Fila', key: 'fila', align: 'center', sortable: false},
                    {title: 'Error', key: 'error', align: 'center', sortable: false}
                ],
                activeTab: 0,
                generalData: null,
                medicamentosData: [],
                allowedSheets: [
                    'Datos Generales',
                    'Listado de Medicamentos'
                ],
                tabs: [
                    { title: 'Datos Generales', value: 0 },
                    { title: 'Medicamentos', value: 1 }
                ]
            };
        },

        computed: {
            dataHeaders() {
                return this.requiredFields.map(field => ({
                    title: field.title,
                    key: field.key,
                    sortable: false,
                    align: 'center'
                }));
            },

            generalHeaders() {
                return this.generalFields.map(field => ({
                    title: field.title,
                    key: field.key,
                    sortable: false,
                    align: 'center'
                }));
            }
        },

        methods: {
            openFileDialog() {
                this.$refs.fileInput.click();
            },

            handleFileSelect(event) {
                const file = event.target.files[0];
                this.validateFile(file);
            },

            handleDrop(event) {
                this.isDragging = false;
                const file = event.dataTransfer.files[0];
                this.validateFile(file);
            },

            validateFile(file) {
                this.error = null;
                this.fileErrors = [];
                this.fileData = [];

                if (!file) return;

                const validTypes = [
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ];

                if (!validTypes.includes(file.type)) {
                    this.file = null;
                    this.error = 'Solo se permiten archivos Excel (.xls, .xlsx)';
                    return;
                }

                this.file = file;
                this.processExcel(file);
            },

            processExcel(file) {
                this.loading = true;
                this.message = 'Procesando Archivo';

                const reader = new FileReader();

                reader.onload = (e) => {
                    try {
                        const data = new Uint8Array(e.target.result);
                        const workbook = XLSX.read(data, { type: 'array' });

                        // 🔹 Validar hojas requeridas
                        const sheetMap = {};
                        workbook.SheetNames.forEach(name => {
                            sheetMap[name.trim().toLowerCase()] = name;
                        });
                        
                        for (const sheet of this.allowedSheets) {
                            const expected = sheet.trim().toLowerCase();

                            if (!sheetMap[expected]) {
                                this.fileErrors.push({
                                    hoja: sheet,
                                    fila: '-',
                                    error: `La hoja "${sheet}" es obligatoria`
                                });
                            }
                        }

                        if (this.fileErrors.length > 0) return;

                        /** ============================
                         * DATOS GENERALES
                         ============================ */
                        const generalSheetName = sheetMap['datos generales'];
                        const generalSheet = workbook.Sheets[generalSheetName];
                        const generalJson = XLSX.utils.sheet_to_json(generalSheet, { defval: null });

                        this.generalData = this.validateGeneralData(generalJson) || null;

                        /** ============================
                         * LISTADO DE MEDICAMENTOS
                         ============================ */
                        const medsSheetName = sheetMap['listado de medicamentos'];
                        const medsSheet = workbook.Sheets[medsSheetName];
                        const medsJson = XLSX.utils.sheet_to_json(medsSheet, { defval: null });

                        const validation = this.validateData('Listado de Medicamentos', medsJson);

                        if (validation.status) {
                            this.medicamentosData = validation.content;
                        }

                    } finally {
                        setTimeout(() => {
                            this.loading = false;
                        }, 800);
                    }
                };

                reader.readAsArrayBuffer(file);
            },

            validateGeneralData(content) {
                if (!content || content.length === 0) {
                    this.fileErrors.push({
                        hoja: 'Datos Generales',
                        fila: '-',
                        campo: 'Vacíos',
                        error: 'Datos Generales está Vacío',
                    });
                    return null;
                }

                const row = content[0];

                for (const field of this.generalFields) {
                    if (!row[field.title] || String(row[field.title]).trim() === '') {
                        this.fileErrors.push({
                            hoja: 'Datos Generales',
                            fila: 2,
                            campo: field.title,
                            error: `Falta el campo "${field.title}"`
                            
                        });
                        return null;
                    }
                }

                return {
                    ruc: String(row['RUC']).trim(),
                    proveedor: String(row['Proveedor']).trim()
                };
            },

            validateData(sheetName, content) {
                let hasErrors = false;
                let rowMapped = []

                content.forEach((row, index) => {
                    if (row['Cantidad'] !== undefined) {
                        row['Cantidad'] = this.normalizeInteger(row['Cantidad']);
                    }

                    if (row['Precio Unitario'] !== undefined) {
                        row['Precio Unitario'] = this.normalizePrice(row['Precio Unitario']);
                    }

                    this.requiredFields.forEach(field => {
                        if(field.title == 'Valor Total' || field.title == '#') return;

                        if (
                            !Object.prototype.hasOwnProperty.call(row, field.title) ||
                            row[field.title] === null ||
                            row[field.title] === undefined ||
                            String(row[field.title]).trim() === ''
                        ) {
                            hasErrors = true;
                            this.fileErrors.push({
                                hoja: sheetName,
                                fila: index + 2,
                                campo: field.title,
                                error: `Falta el campo "${field.title}"`
                            });
                        }

                        if (field.title === 'Fecha Elaboración' || field.title === 'Fecha Caducidad') {
                            const normalized = this.normalizeDate(row[field.title]);

                            if (!normalized) {
                                hasErrors = true;
                                this.fileErrors.push({
                                    hoja: sheetName,
                                    fila: index + 2,
                                    campo: field.title,
                                    error: `Formato de ${field.title} inválido. FORMATO VÁLIDO: DD-MM-YYYY`
                                });
                            } else {
                                row[field.title] = normalized;
                            }
                        }

                        if (field.title === 'Descripción') {
                            if (!this.validateDescription(row[field.title])) {
                                hasErrors = true;
                                this.fileErrors.push({
                                    hoja: sheetName,
                                    fila: index + 2,
                                    campo: field.title,
                                    error: 'La descripción debe contener gramaje válido (ej: 500mg, 5gr)'
                                });
                            }
                        }
                    });

                    if (
                        row['Cantidad'] !== null &&
                        row['Precio Unitario'] !== null
                    ) {
                        row['Valor Total'] = Number(
                            (row['Cantidad'] * row['Precio Unitario']).toFixed(2)
                        );
                    }

                    if (!hasErrors){
                        rowMapped.push({
                            medicamento: row['Medicamento'],
                            descripcion: this.normalizeDescription(row['Descripción']),
                            presentacion: row['Presentación'],
                            cantidad: row['Cantidad'],
                            lote: row['Lote'],
                            fecha_elaboracion: row['Fecha Elaboración'],
                            fecha_caducidad: row['Fecha Caducidad'],
                            registro_sanitario: row['Registro Sanitario'],
                            precio_unitario: row['Precio Unitario'],
                            valor_total: row['Valor Total']
                        });
                    }
                });

                return {status: !hasErrors, content: rowMapped};
            },

            normalizeInteger(value) {
                const num = Number(value);
                if (isNaN(num)) return null;
                return Math.round(num);
            },

            normalizeDescription(value) {
                if (!value) return null;

                const text = String(value).trim().toLowerCase();

                const match = text.match(/^(\d+(?:\.\d+)?)\s*(gr|g|mg|mgr)$/i);

                if (!match) return null;

                let amount = match[1];
                let unit = match[2];

                if (unit === 'gr') unit = 'g';
                if (unit === 'mgr') unit = 'mg';

                return `${amount}${unit}`;
            },

            normalizePrice(value) {
                if (value === null || value === undefined) return null;

                const cleaned = String(value).replace(/[^0-9.-]+/g, '');
                const num = Number(cleaned);

                if (isNaN(num)) return null;

                return Number(num.toFixed(2));
            },

            excelSerialToDate(serial) {
                const excelEpoch = new Date(1899, 11, 30);
                const date = new Date(excelEpoch.getTime() + serial * 86400000);

                return this.formatDate(date);
            },

            formatDate(date) {
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();

                return `${day}-${month}-${year}`;
            },

            normalizeDate(value) {
                if (!value) return null;

                if (typeof value === 'number') {
                    return this.excelSerialToDate(value);
                }

                if (typeof value === 'string') {
                    const clean = value.trim().replace(/\//g, '-');

                    if (/^\d{2}-\d{2}-\d{4}$/.test(clean)) {
                        const [d, m] = clean.split('-').map(Number);
                        if (d <= 31 && m <= 12) return clean;
                    }

                    if (/^\d{2}-\d{2}-\d{4}$/.test(clean)) {
                        const [a, b, y] = clean.split('-').map(Number);

                        if (a <= 12 && b <= 31) {
                            return `${String(b).padStart(2, '0')}-${String(a).padStart(2, '0')}-${y}`;
                        }
                    }
                }

                return null;
            },

            validateDescription(value) {
                if (!value) return false;

                const regex = /^\d+(\.\d+)?\s?(gr|g|mg|mgr)$/i;
                return regex.test(String(value).trim());
            },

            triggerNotification(message, status){
                this.notificationMessage.message = message;
                this.notificationMessage.show = true;
                this.notificationMessage.ok = status;

                setTimeout(() => {
                    this.notificationMessage.show = false;
                }, 3000);
            },

            formatCurrency(value) {
                if (value === null || value === undefined || isNaN(value)) return '$ 0.00';

                return `$ ${Number(value).toFixed(2)}`;
            },

            resetFile(){
                this.file = null; 
                this.fileErrors = []; 
                this.fileData = []
            },

            async downloadTemplate(){
                this.loading = true;
                this.message = 'Descargando Plantilla';

                try {
                    const response = await providerService.downloadTemplate();
                    const blob = new Blob([response]);
                    const url = window.URL.createObjectURL(blob);

                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'Plantilla Medicamentos.xlsx';
                    link.click();

                    window.URL.revokeObjectURL(url);
                } catch (error) {
                    console.log(error)
                }finally{
                    setTimeout(() => {
                        this.loading = false;
                    }, 1000)
                }
            },

            async saveData(){
                this.loading = true;
                this.message = 'Guardando Información';
                let success = true;
                let message = 'Medicamentos guardados con éxito';

                try {
                    const data = {
                        general: this.generalData,
                        medicamentos: this.medicamentosData
                    }
                    
                    await providerService.uploadMedication(data);
                } catch (error) {
                    success = false;
                    message = 'Error al guardar la información';
                }finally{
                    setTimeout(() => {
                        this.loading = false;
                        this.triggerNotification(message, success);
                        this.resetFile();
                    }, 1000)
                }
            }
        },
    };
</script>

<style scoped>
    .dropzone {
        border: 2px dashed #4CAF50;
        border-radius: 12px;
        padding: 40px;
        text-align: center;
        transition: all 0.2s ease;
        height: calc(100dvh - 150px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .dropzone--active {
        background-color: #e8f5e9;
        border-color: #4CAF50;
    }

    .dropzone p {
        margin: 8px 0;
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
