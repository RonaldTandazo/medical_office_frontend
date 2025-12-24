<template>
    <v-app>
        <ToolBar pageTitle="Medications Dashboard"></ToolBar>
        <v-container>
            <v-row>
                <v-col cols="12" class="d-flex justify-start">
                    <h2 class="text-h4">Medications Dashboard</h2>
                </v-col>
            </v-row>
            <v-row>
                <AdaptativeBreadcrumbs :routes="routes"></AdaptativeBreadcrumbs>
            </v-row>
            <v-row>
                <DashboardCards :cards="cards"></DashboardCards>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
    import ToolBar from "../../components/General/ToolBar.vue"
    import AdaptativeBreadcrumbs from "../../components/General/AdaptativeBreadcrumbs.vue"
    import DashboardCards from "../../components/General/DashboardCards.vue"
    import { mapGetters } from 'vuex'
    
    export default {
        name: 'MedicationsDashboard',
        components: {
            ToolBar,
            AdaptativeBreadcrumbs,
            DashboardCards
        },
        data: () => ({
            routes: [
                {
                    title: 'Dashboard',
                    disabled: false,
                    href: '/home'
                },
                {
                    title: 'Medications Dashboard',
                    disabled: true,
                    href: '/medications'
                }
            ],
            cards: []
        }),
        
        computed: {
            ...mapGetters('location', ['getLocatedMenu']),
        },

        mounted() {
            const menu = this.getLocatedMenu
            this.cards = menu.submenus.map((submenu) => {
                return {
                    submenu_id: submenu.submenu_id,
                    title: submenu.name,
                    href: submenu.path,
                    icon: submenu.icon,
                }
            })
        },
    }
</script>