<template>
    <v-app>
        <ToolBar pageTitle="Generate Recipe"></ToolBar>
        <v-container>
            <v-row>
                <v-col cols="12" class="d-flex justify-start">
                    <h2 class="text-h4">Generate Recipe</h2>
                </v-col>
            </v-row>
            <v-row>
                <AdaptativeBreadcrumbs :routes="routes"></AdaptativeBreadcrumbs>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
    import ToolBar from '../../components/General/ToolBar.vue';
    import AdaptativeBreadcrumbs from '../../components/General/AdaptativeBreadcrumbs.vue';
    
    export default {
        name: 'GenerateRecipe',
        components: {
            ToolBar,
            AdaptativeBreadcrumbs,
        },
        data: () => ({
            routes: [
                {
                    title: 'Dashboard',
                    disabled: false,
                    href: '/home'
                },
                {
                    title: 'Patients Dashboard',
                    disabled: false,
                    href: '/patients'
                },
                {
                    title: 'Generate Recipe',
                    disabled: true,
                    href: '/patients/generate_recipe'
                }
            ],
        })
    }
</script>

<style scoped>
</style>
