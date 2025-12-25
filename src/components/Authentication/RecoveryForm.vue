<template>
    <div>
        <div class="text-center my-8">
            <v-icon
                size="56"
                color="blue"
                class="mb-2"
            >
                mdi-pill-multiple
            </v-icon>

            <div class="text-h4 font-weight-bold">
                Recep<span class="text-blue">Sync</span>
            </div>
        </div>
  
        <v-card
            class="mx-auto pa-12 pb-8"
            elevation="8"
            max-width="448"
            rounded="lg"
        >
        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">E-mail</div>
        <v-text-field
            clearable
            v-model='email'
            density="compact"
            placeholder="Dirección E-mail"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            :disabled="disabled"
            :loading="loading"
        ></v-text-field>
  
        <v-btn
            class="mb-8"
            color="blue"
            size="large"
            variant="tonal"
            block
            @click="recover_password"
            :disabled="!isRecoverAvailable || loading"
        >
            Recuperar Contraseña
        </v-btn>
        
      </v-card>
    </div>
  </template>
  
  <script>
    import { authService } from '../../services/authService';
  
    export default {
        data: () => ({
            disabled: false, 
            loading: false,
            email:'',
        }),

        computed: {
            isRecoverAvailable(){
                return this.email !== '';
            }
        },
  
        methods: {
            async recover_password() {
                this.disabled = true
                this.loading = true

                try {
                    const response = await authService.sendRecoverEmail({email: this.email});

                    if(!response.success){
                        this.$emit('notify', {message: response.message, ok: response.success, show: true});
                        return null
                    }

                    this.$emit('recover-success', {tittle: response.message, message: "Se ha enviado un correo a tu E-mail para que restablezcas tu contraseña", state: 200});

                } catch (error) {
                    this.$emit('notify', {message: error.message, ok:false, show: true});
                } finally {
                    this.loading = false
                    this.disabled = false
                }
            },
        }
    }
  </script>