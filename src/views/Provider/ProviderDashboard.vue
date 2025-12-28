<template>
    <v-app>
        <ToolBar pageTitle="Provider Dashboard"></ToolBar>
        <v-container>
            <v-row>
                <v-col cols="12" class="d-flex justify-space-between">
                    <h2 class="text-h4">Dashboard Proveedores</h2>
                    <v-btn 
                        prependIcon="mdi-content-copy"
                        color="blue-accent-2"
                        @click="copyProviderLink()"
                    >
                        Link Carga de Proveedores
                    </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <AdaptativeBreadcrumbs :routes="routes"></AdaptativeBreadcrumbs>
            </v-row>
            <v-row>
                <DashboardCards :cards="cards"></DashboardCards>
            </v-row>
        </v-container>

        <v-snackbar 
            v-model="snackbar" 
            timeout="3000" 
            color="blue-accent-2"
            width="50"
        >
            Link de Acceso Copiado
        </v-snackbar>
    </v-app>
</template>

<script>
    import ToolBar from "../../components/General/ToolBar.vue"
    import AdaptativeBreadcrumbs from "../../components/General/AdaptativeBreadcrumbs.vue"
    import DashboardCards from "../../components/General/DashboardCards.vue"
    import { mapGetters } from 'vuex'
    
    export default {
        name: 'ProviderDashboard',
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
                    title: 'Dashboard Proveedores',
                    disabled: true,
                    href: '/provider'
                }
            ],
            cards: [],
            snackbar: false,
            providerUrl: window.location.origin + '/provider/upload'
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

        methods: {
            async copyProviderLink() {
                try {
                    await navigator.clipboard.writeText(this.providerUrl);
                    this.snackbar = true;
                } catch (err) {
                    console.error("Error al copiar: ", err);
                }
            }
        }
    }
</script>