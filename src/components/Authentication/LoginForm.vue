<template>
  <div>
    <v-img
      class="mx-auto my-6"
      max-width="228"
      src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
    ></v-img>

    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">E-mail</div>
      <v-text-field
        v-model='email'
        density="compact"
        placeholder="Dirección E-mail"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        :disabled="disabled"
        :loading="loading"
      ></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Contraseña
        <router-link
          class="text-caption text-decoration-none text-blue"
          to="/recovery"
        >
          Olvidaste la contraseña?
        </router-link>
      </div>
      <v-text-field
        v-model="password"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Ingresa tu Contraseña"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="visible = !visible"
        :disabled="disabled"
        :loading="loading"
      ></v-text-field>

      <div v-if="showRoles" class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">Rol</div>
      <v-select
        clearable
        v-if="showRoles"
        v-model="selectedRole"
        :items="roles"
        item-title="name"
        item-value="role_id"
        placeholder="Seleccione un rol"
        variant="solo"
        return-object
      ></v-select>

      <!-- <v-card
        class="mb-12"
        color="surface-variant"
        variant="tonal"
      >
        <v-card-text class="text-medium-emphasis text-caption">
          Warning: After 3 consecutive failed login attempts, you account will be temporarily locked for three hours. If you must login now, you can also click "Forgot login password?" below to reset the login password.
        </v-card-text>
      </v-card> -->

      <v-btn
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        block
        @click="onLogin"
        :disabled="!isLoginDisable || loading"
      >
        Iniciar Sesión
      </v-btn>

      <v-card-text class="text-center">
        <router-link
          class="text-blue text-decoration-none"
          to="/signup"
        >
          Regístrate Aquí <v-icon icon="mdi-chevron-right"></v-icon>
        </router-link>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import { authService } from '../../services/authService';
  import { roleService } from '../../services/roleService';
  import { jwtDecode } from 'jwt-decode'
  import { mapActions, mapGetters } from 'vuex';

  export default {
    data: () => ({
      visible: false,
      disabled: false, 
      loading: false,
      email:'',
      password:'',
      debounceTimeout: null,
      roles: [],
      showRoles: false,
      selectedRole: null
    }),

    computed: {
      ...mapGetters('auth', ['getUserData']),
      isLoginDisable(){
        return this.email != '' && this.password != '' && this.selectedRole != null;
      }
    },

    watch: {
      email(newEmail) {
        this.showRoles = false
        this.selectedRole = null
        if (this.debounceTimeout) {
          clearTimeout(this.debounceTimeout);
        }
        
        this.debounceTimeout = setTimeout(() => {
          if (newEmail) {
            this.getUserRoles(newEmail);
          }
        }, 500);
      },
    },

    methods: {   
      ...mapActions('auth', ['login', 'logout']),
      ...mapActions('location', ['located']),

      async getUserRoles(email) {
        try {
          const response = await roleService.getUserRoles({email: email});
          if(!response.success){
            this.$emit('notify', {message: response.message, ok: false, show: true});
            return null
          }

          this.roles = response.data.map((role) => ({
            role_id: role.role_id,
            name: role.name
          }))
          
          this.showRoles = true
        } catch (error) {
          const message_error = error.response.data.message
          this.$emit('notify', {message: message_error, ok:false, show: true});
        }
      },

      async onLogin() {
        try {
          this.disabled = true
          this.loading = true
          
          const response = await authService.loginUser({email: this.email, password: this.password, roleId: this.selectedRole.role_id, role: this.selectedRole.name});

          if (response.data) {
            const token = response.data.token
            localStorage.setItem('jwt', token);

            const decodedToken = jwtDecode(token);
            const userData = decodedToken.user_data;
            const permissions = decodedToken.permissions || [];
            
            this.located(permissions.find(menu => menu.menu_id == 6))
            this.login({ userData, permissions });

            this.$router.push('/home');
          }
        } catch (error) {
          this.$emit('notify', {message:"Inicio de Sesión Fallido", ok:false, show: true});
        } finally {
          this.loading = false
          this.disabled = false
        }
      },
    }
  }
</script>