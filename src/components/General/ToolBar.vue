<template>
    <div>
        <v-app-bar
            prominent
        >
            <v-toolbar color="blue-accent-2">
                <v-app-bar-nav-icon v-if="logged" density="comfortable" class="ms-3" @click.stop="drawer = !drawer" variant="text"></v-app-bar-nav-icon>
                <h1  v-if="!logged && pageTitle" class="ms-3">{{ pageTitle }}</h1>
                <v-spacer></v-spacer>
                <UserActions v-if="logged" class="mr-5"/>
            </v-toolbar>
        </v-app-bar>
        <v-navigation-drawer
            v-model="drawer"
            width="200"
            temporary
        >
            <v-list>
                <v-list-item
                    v-for="item in items"
                    :key="item.menu_id"
                    :active="isActive(item)"
                    @click="navigateTo(item)"
                    class="drawer-item"
                >
                    <template v-slot:prepend>
                        <v-icon
                            :icon="item.icon"
                            :color="isActive(item) ? 'white' : 'blue'"
                        ></v-icon>
                    </template>

                    <v-list-item-title
                        :class="{ 'text-white': isActive(item) }"
                    >
                        {{ item.title }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
    import UserActions from "./UserActions.vue"
    import { mapActions, mapGetters } from "vuex"

    export default {
        name:"ToolBar",
        props:{
            logged: {
                type: Boolean,
                default: true
            },
            pageTitle: {
                type: String,
                default: null
            }
        },
        components: {
            UserActions
        },
        data: () => ({
            drawer: false,
            items: []
        }),

        computed: {
            ...mapGetters('auth', ['getPermissions']),
            ...mapGetters('location', ['getLocatedMenu'])
        },

        mounted() {
            this.items = this.getPermissions.map((menu) => {
                return {
                    title: menu.menu,
                    icon: menu.icon,
                    menu_id: menu.menu_id,
                    route: menu.path,
                    submenus: menu.submenus
                }
            })
        },

        methods: {
            ...mapActions('location', ['located']),

            isActive(item) {
                return item.menu_id == this.getLocatedMenu.menu_id
            },

            navigateTo(item) {
                this.located(item);
                this.$router.push(item.route);
                this.drawer = false;
            }
        }
    }
</script>

<style scoped>
    .drawer-item {
        border-radius: 8px;
        margin: 4px 8px;
        transition: background-color 0.2s ease;
    }

    .drawer-item.v-list-item--active {
        background-color: #448AFF;
    }

    .drawer-item.v-list-item--active:hover {
        background-color: #1565c0;
    }
</style>