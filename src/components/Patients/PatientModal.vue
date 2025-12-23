<template>
    <v-dialog :value="internalModalOpen" max-width="55%" transition="dialog-top-transition" persistent>
        <form @submit.prevent="savePatientInformation">
            <v-card
                prepend-icon="mdi-account-injury"
                :title="state == 'new' ? 'New Patient':'Edit Information'"
            >
                <v-divider></v-divider>
                <v-card-text>
                    <v-row cols="12">
                        <v-col cols="6">
                            <v-text-field
                                v-model="data.name"
                                :error-messages="v$.name.$errors.map(e => e.$message)"
                                clearable
                                density="compact"
                                label="Name"
                                variant="outlined"
                                prepend-inner-icon="mdi-alpha-n-box"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field
                                v-model="data.lastname"
                                :error-messages="v$.lastname.$errors.map(e => e.$message)"
                                clearable
                                density="compact"
                                label="Last Name"
                                variant="outlined"
                                prepend-inner-icon="mdi-alpha-l-box"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row cols="12">
                        <v-col cols="6">
                            <v-text-field
                                v-model="data.identification"
                                :error-messages="v$.identification.$errors.map(e => e.$message)"
                                clearable
                                density="compact"
                                label="Identification"
                                variant="outlined"
                                prepend-inner-icon="mdi-card-account-details"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <div class="text-start ms-14" style="color: grey; font-size:13px;">
                                Age
                            </div>
                            <v-slider
                                v-model="data.age"
                                :min="0"
                                :max="110"
                                :step="1"
                                prepend-icon="mdi-calendar-range"
                                :thumb-size="15"
                                thumb-label="always"
                            >
                                <template v-slot:append>
                                    <v-text-field
                                        v-model="data.age"
                                        density="compact"
                                        variant="outlined"
                                        style="width: 85px"
                                        type="number"
                                        hide-details
                                        single-line
                                        :min="0"
                                        :max="110"
                                        :step="1"
                                    ></v-text-field>
                                </template>
                            </v-slider>
                        </v-col>
                    </v-row>
                    <v-row cols="12">
                        <v-col cols="12">
                            <div class="text-start ms-14" style="color: grey; font-size:13px;">
                                Weight(Kg)
                            </div>
                            <v-slider
                                v-model="data.weight"
                                :min="45"
                                :max="150"
                                :step="0.1"
                                prepend-icon="mdi-weight-kilogram"
                                :thumb-size="15"
                                thumb-label="always"
                            >
                                <template v-slot:append>
                                    <v-text-field
                                        v-model="data.weight"
                                        density="compact"
                                        variant="outlined"
                                        style="width: 93px"
                                        type="number"
                                        hide-details
                                        single-line
                                        :min="45"
                                        :max="150"
                                        :step="0.1"
                                    ></v-text-field>
                                </template>
                            </v-slider>
                        </v-col>
                    </v-row>
                    <v-row cols="12">
                        <v-col cols="12">
                            <div class="text-start ms-14" style="color: grey; font-size:13px;">
                                Height(m)
                            </div>
                            <v-slider
                                v-model="data.height"
                                :min="0"
                                :max="3"
                                :step="0.01"
                                prepend-icon="mdi-human-male-height-variant"
                                :thumb-size="15"
                                thumb-label="always"
                            >
                                <template v-slot:append>
                                    <v-text-field
                                        v-model="data.height"
                                        density="compact"
                                        variant="outlined"
                                        style="width: 85px"
                                        type="number"
                                        hide-details
                                        single-line
                                        :min="0"
                                        :max="3"
                                        :step="0.01"
                                    ></v-text-field>
                                </template>
                            </v-slider>
                        </v-col>
                    </v-row>
                    <v-row cols="12">
                        <v-col cols="6">
                            <v-select
                                v-model="data.gender"
                                :error-messages="v$.gender.$errors.map(e => e.$message)"
                                clearable
                                :items="genders"
                                item-title="label"
                                item-value="value"
                                label="Gender"
                                variant="outlined"
                                density="compact"
                                prepend-inner-icon="mdi-gender-male"
                                required
                            ></v-select>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field
                                v-model="data.phone"
                                :error-messages="v$.phone.$errors.map(e => e.$message)"
                                clearable
                                prepend-inner-icon="mdi-phone"
                                label="Phone Number"
                                variant="outlined"
                                density="compact"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row cols="12">
                        <v-col cols="6">
                            <v-text-field
                                v-model="data.direction"
                                :error-messages="v$.direction.$errors.map(e => e.$message)"
                                clearable
                                prepend-inner-icon="mdi-map-marker"
                                label="Direction"
                                variant="outlined"
                                density="compact"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field
                                v-model="data.email"
                                :error-messages="v$.email.$errors.map(e => e.$message)"
                                clearable
                                prepend-inner-icon="mdi-email"
                                label="E-Mail"
                                variant="outlined"
                                density="compact"
                                required
                                @input="v$.email.$touch"
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
    import { email, required } from '@vuelidate/validators';
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
        genders: {
            type: Array,
            required: true
        },
        record: {
            type: Object,
            required: false
        }        
    });

    const internalModalOpen = reactive({ value: props.isModalOpen });

    const patient = props.state == "new" ? {
        name: null,
        lastname: null,
        identification: null,
        age: null,
        gender: null,
        height: null,
        weight: null,
        phone: null,
        direction: null,
        email: null,
        status: 'A'
    }:props.record

    const data = reactive({
        ...patient,
    })

    const emit = defineEmits(['save', 'close']);

    const rules = {
        name: { required },
        lastname: { required },
        identification: { required },
        gender: { required },
        phone: { required },
        direction: { required },
        email: { required, email }
    };

    const v$ = useVuelidate(rules, data);

    watch(() => props.isModalOpen, (val) => {
        internalModalOpen.value = val;
    });

    function savePatientInformation() {
        if (v$.value.$invalid) return;

        const save = {patient: data, state: props.state}
        emit('save', save);
        closeModal()
    }

    function closeModal() {
        emit('close');
    }
</script>
