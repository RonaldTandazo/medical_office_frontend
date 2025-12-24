<template>
  <v-sheet
    class="pa-4 text-center mx-auto"
    elevation="12"
    max-width="600"
    rounded="lg"
    width="100%"
  >
    <v-icon
      class="mb-5"
      :color="successStatus == 200 ? 'success':'red-accent-2'"
      :icon="successStatus == 200 ? 'mdi-email-fast-outline':'mdi-timer-alert-outline'"
      size="112"
    ></v-icon>

    <h2 class="text-h5 mb-6">{{ successTittle }}</h2>

    <p class="mb-4 text-medium-emphasis text-body-2">
      {{ successMessage }}
    </p>

    <v-divider class="mb-4"></v-divider>

    <div class="text-end">
      <v-btn
        class="text-none"
        :color="successStatus == 200 ? 'success':'red-accent-2'"
        variant="flat"
        width="90"
        rounded
        @click="done"
      >
        Inicia Sesión
      </v-btn>
    </div>
  </v-sheet>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters(['getSuccessTittle', 'getSuccessMessage', 'getSuccessStatus']),
      successTittle() {
        return this.getSuccessTittle;
      },
      successMessage() {
        return this.getSuccessMessage;
      },
      successStatus(){
        return this.getSuccessStatus;
      }
    },
    methods: {
      done() {
        this.$router.push("/");
      }
    }
  }
</script>
