<template>
    <v-app>
        <ToolBar pageTitle="Account Information"></ToolBar>
        <!-- <v-main> -->
            <v-container>
                <v-row>
                    <v-col cols="12" class="d-flex justify-start">
                        <h2 class="text-h4">Account Information</h2>
                    </v-col>
                </v-row>
                
                <v-row>
                    <AdaptativeBreadcrumbs :routes="routes"></AdaptativeBreadcrumbs>
                    <v-col cols="12" class="d-flex flex-column">
                        <v-card class="pa-md-6 elevation-6" >
                            <UserTabs :userInfo="userInfo" @notify="triggerNotification"></UserTabs>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        <!-- </v-main> -->
        <v-slide-x-reverse-transition>
            <NotificacionAlert :info="notificationMessage" v-if="showNotification" />
        </v-slide-x-reverse-transition>
    </v-app>
</template>

<script>
    import ToolBar from '../../components/General/ToolBar.vue';
    import AdaptativeBreadcrumbs from '../../components/General/AdaptativeBreadcrumbs.vue';
    import UserTabs from '../../components/User/UserTabs.vue';
    import NotificacionAlert from "../../components/General/NotificationAlert.vue";

    export default {
        name: 'AccountInformation',
        components: {
            ToolBar,
            AdaptativeBreadcrumbs,
            UserTabs,
            NotificacionAlert
        },
        data: () => ({
            userInfo: null,
            routes: [
                {
                    title: 'Dashboard',
                    disabled: false,
                    href: '/home'
                },
                {
                    title: 'Account Dashboard',
                    disabled: false,
                    href: '/account'
                },
                {
                    title: 'Account Information',
                    disabled: true,
                    href: '/account/account_information'
                }
            ],
            showNotification: false,
            notificationMessage: null
        }),
        methods: {
            triggerNotification(info) {
                this.notificationMessage = info;
                this.showNotification = true;
                setTimeout(() => {
                    this.showNotification = false;
                }, 3000);
            } 
        },
    }
</script>
