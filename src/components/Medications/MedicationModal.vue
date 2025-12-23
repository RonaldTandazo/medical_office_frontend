<template>
    <v-dialog :value="internalModalOpen" max-width="55%" transition="dialog-top-transition" persistent>
        <form @submit.prevent="saveMedication">
            <v-card
                prepend-icon="mdi-pill"
                :title="state == 'new' ? 'New Medication':'Edit Information'"
            >
                <v-divider></v-divider>
                <v-card-text>
                    <v-row cols="12">
                        <v-col cols="12">
                            <v-text-field
                                v-model="data.medication"
                                :error-messages="v$.medication.$errors.map(e => e.$message)"
                                clearable
                                density="compact"
                                label="Name"
                                variant="outlined"
                                prepend-inner-icon="mdi-alpha-n-box"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row cols="12">
                        <v-col cols="6">
                            <v-select
                                v-model="data.type"
                                :error-messages="v$.type.$errors.map(e => e.$message)"
                                clearable
                                :items="genders"
                                item-title="label"
                                item-value="value"
                                label="Medication Type"
                                variant="outlined"
                                density="compact"
                                required
                                return-object
                            ></v-select>
                        </v-col>
                        <v-col cols="6">
                            <v-select
                                v-model="data.diseases"
                                :error-messages="v$.diseases.$errors.map(e => e.$message)"
                                clearable
                                multiple
                                :items="genders"
                                item-title="label"
                                item-value="value"
                                label="Diseases"
                                variant="outlined"
                                density="compact"
                                required
                                return-object
                            ></v-select>
                        </v-col>
                    </v-row>
                    <v-row cols="12">
                        <v-col cols="6">
                            <v-select
                                v-model="data.laboratory"
                                :error-messages="v$.laboratory.$errors.map(e => e.$message)"
                                clearable
                                :items="genders"
                                item-title="label"
                                item-value="value"
                                label="Laboratory"
                                variant="outlined"
                                density="compact"
                                prepend-inner-icon="mdi-chemical-weapon"
                                required
                                return-object
                            ></v-select>
                        </v-col>
                        <v-col cols="6">
                            <v-select
                                v-model="data.unit"
                                :error-messages="v$.unit.$errors.map(e => e.$message)"
                                clearable
                                :items="genders"
                                item-title="label"
                                item-value="value"
                                label="Unit"
                                variant="outlined"
                                density="compact"
                                prepend-inner-icon="mdi-package"
                                required
                                return-object
                            ></v-select>
                        </v-col>
                    </v-row>
                    <v-row cols="12">
                        <v-col cols="6">
                            <v-text-field
                                v-model="data.grams"
                                :error-messages="v$.grams.$errors.map(e => e.$message)"
                                @blur="v$.grams.$touch()"
                                clearable
                                prepend-inner-icon="mdi-weight-gram"
                                label="Grams"
                                variant="outlined"
                                density="compact"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field
                                v-model="data.price"
                                :error-messages="v$.price.$errors.map(e => e.$message)"
                                @blur="v$.price.$touch()"
                                clearable
                                prepend-inner-icon="mdi-currency-usd"
                                label="Price"
                                variant="outlined"
                                density="compact"
                                type="number"
                                step="0.01"
                                min="0"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        text="Close"
                        variant="plain"
                        @click="closeModal"
                        prepend-icon="mdi-close-circle"
                    ></v-btn>
                    <v-btn
                        color="primary"
                        text="Save"
                        variant="tonal"
                        :disabled="v$.$invalid"
                        prepend-icon="mdi-content-save"
                        type="submit"
                    ></v-btn>
                </v-card-actions>
            </v-card>
        </form>
    </v-dialog>
</template>

<script setup>
    import { reactive, watch } from 'vue';
    import { useVuelidate } from '@vuelidate/core';
    import { required, helpers } from '@vuelidate/validators';
    import { defineProps, defineEmits } from 'vue';

    // Props
    const props = defineProps({
        isModalOpen: {
            type: Boolean,
            required: true,
        },
        state: {
            type: String,
            required: true
        },
        record: {
            type: Object,
            required: false
        }        
    });

    const internalModalOpen = reactive({ value: props.isModalOpen });

    const medication = props.state == "new" ? {
        medication: null,
        type: null,
        diseases: null,
        laboratory: null,
        unit: null,
        grams: null,
        price: null,
        status: 'A'
    }:props.record

    const data = reactive({
        ...medication,
    })

    const genders = [{value: "ejeje", label: "ekeke"}, {value: "ajajajaj", label: "ajajajaj"}];

    const emit = defineEmits(['save', 'close']);

    const priceFormat = helpers.withMessage(
        'Only numbers with up to 2 decimals are allowed',
        value => {
            if (value === null || value === '') return false;
            return /^\d+(\.\d{1,2})?$/.test(value);
        }
    );

    const gramsFormat = helpers.withMessage(
        'Format must be like: 500 mg, 1 gr, 2.5 g',
        value => {
            if (value === null || value === '') return false;
            return /^\d+(\.\d+)?\s?(mg|g|gr|mcg|kg)$/i.test(value);
        }
    );

    const rules = {
        medication: { required },
        type: { required },
        diseases: { required },
        laboratory: { required },
        unit: { required },
        grams: { required, gramsFormat },
        price: { required, priceFormat }
    };

    const v$ = useVuelidate(rules, data);

    watch(() => props.isModalOpen, (val) => {
        internalModalOpen.value = val;
    });

    function saveMedication() {
        if (v$.value.$invalid) return;

        const save = {medication: data, state: props.state}
        emit('save', save);
        closeModal()
    }

    function closeModal() {
        emit('close');
    }
</script>
