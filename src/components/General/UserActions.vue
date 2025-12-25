<template>
    <div class="text-center">
        <v-menu
            v-model="menu"
            :close-on-content-click="false"
            location="end"
        >
            <template v-slot:activator="{ props }">
                <v-btn
                    class="user-icon"
                    v-bind="props"
                    density="comfortable"
                    icon="mdi-account"
                    variant="outlined"
                >
                </v-btn>
            </template>

            <v-card min-width="300">
                <v-list>
                    <v-list-item
                        :subtitle="userInfo ? userInfo.email + ' | ' + userInfo.role : ''"
                        :title="userInfo ? userInfo.username : ''"
                    >
                        <template #prepend>
                            <v-avatar v-if="userInfo?.avatar" size="40">
                                <v-img :src="userInfo.avatar" alt="Avatar" />
                            </v-avatar>

                            <v-avatar v-else color="blue-lighten-4" size="40">
                                <v-icon color="blue-darken-2">
                                    mdi-account
                                </v-icon>
                            </v-avatar>
                        </template>
                    </v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-list>
                    <!-- <v-list-item
                        key="1"
                        value="1"
                        class="custom-icon"
                        @click="editProfile"
                    >
                        <v-list-item-title>
                            Account Information
                        </v-list-item-title>
                        <template v-slot:append>
                            <v-icon
                                icon="mdi-account-edit"
                                color="blue"
                            ></v-icon>
                        </template>
                    </v-list-item> -->
                    <v-list-item
                        key="2"
                        value="2"
                        @click="onLogout"
                    >
                        <v-list-item-title>
                            Cerrar Sesión
                        </v-list-item-title>
                        <template v-slot:append>
                            <v-icon
                                icon="mdi-logout"
                                color="red-accent-4"
                            ></v-icon>
                        </template>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-menu>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    
    export default {    
        data: () => ({
            menu: false,
            userInfo: null
        }),

        computed: {
            ...mapGetters('auth', ['getUserData']),
        },

        mounted() {
            this.userInfo = this.getUserData
        },

        methods: {
            ...mapActions('auth', ['logout']),

            editProfile(){
                this.$router.push({ name: 'AccountInformation' });
            },

            onLogout(){
                this.logout()
                this.$router.push({ name: 'LoginForm' });
            }
        },    
    }
</script>