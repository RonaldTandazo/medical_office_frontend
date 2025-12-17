<template>
    <v-row
        class="d-flex flex-wrap justify-start"
    >
        <v-col
            v-for="card in cards"
            :key="card.title"
            cols="12"
            sm="6"       
            md="4"       
            lg="3"       
            class="d-flex"
        >
            <v-card
                class="mx-auto my-2"
                width="400"
                target="_blank"
                @click="navigateTo(card.href)"
                v-bind:key="card.submenu_id"
                :title="card.title"
            >
                <template v-slot:title>
                    <v-card-title class="text-subtitle-1 text-justify font-weight-regular">{{ card.title }}</v-card-title>
                </template>
                <template v-slot:prepend>
                    <v-icon color="primary" :icon="card.icon"></v-icon>
                </template>
                <template v-slot:append>
                    <v-icon icon="mdi-chevron-right"></v-icon>
                </template>
            </v-card>
        </v-col>
    </v-row>
</template>
  
<script>
    export default {
        props: {
            cards: {
                type: Array,
                required: true
            }
        },
        methods: {
            navigateTo(route) {
                const targetPath = this.$route.path + route;
                this.$router.push(`${targetPath}`);
            }
        }
    };
</script>
  