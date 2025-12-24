<template>
    <v-app>
        <ToolBar pageTitle="Users"></ToolBar>
        <v-container>
            <v-row>
                <v-col cols="12" class="d-flex justify-start">
                    <h2 class="text-h4">Users</h2>
                </v-col>
            </v-row>
            <v-row>
                <AdaptativeBreadcrumbs :routes="routes"></AdaptativeBreadcrumbs>
            </v-row>
            <v-row>
                <v-expansion-panels variant="accordion">
                    <v-expansion-panel title="Search Filters">
                        <v-expansion-panel-text>
                            <v-row cols="12">
                                <v-col cols="3">
                                    <v-text-field
                                        v-model="identification"
                                        density="compact"
                                        label="Identification"
                                        clearable
                                        variant="outlined"
                                        prepend-inner-icon="mdi-card-account-details"
                                    >    
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="6" class="d-flex justify-start">
                                    <v-btn
                                        prepend-icon="mdi-account-plus"
                                        color="white"
                                        class="me-2"
                                        ref="modalBtn"
                                        @click="isModalOpen = true; state='new'"
                                    >
                                        New User
                                    </v-btn>
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="6" class="d-flex justify-end">
                                    <v-btn
                                        prepend-icon="mdi-eraser"
                                        color="black"
                                        class="me-2"
                                        @click="cleanFilters"
                                    >
                                        Clear
                                    </v-btn>
                                    <v-btn
                                        prepend-icon="mdi-cloud-search"
                                        color="blue-accent-2"
                                        @click="getAllUsers({page: 1, itemsPerPage})"
                                    >
                                        Search
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-row>
            <v-row class="py-md-5">
                <v-divider></v-divider>
            </v-row>
            <v-row>
                <v-card class="pa-md-3 elevation-1" width="100%">
                    <div class="table-container">
                        <v-data-table-server
                            v-model:items-per-page="itemsPerPage"
                            :headers="columns"
                            :items="users"
                            :items-length="totalItems"
                            item-value="user_id"
                            :loading="loading"
                            loading-text="Loading Records...Please wait"
                            no-data-text="No Users"
                            fixed-header
                            show-expand
                        >
                            <template v-slot:[`item.actions`]="{ item }">
                                <v-btn icon density="compact" size="large" @click="openDialog(item, 'User')">
                                    <v-icon color="blue-grey-darken-4">
                                        {{ item.status === 'A' ? 'mdi-account-off' : 'mdi-account-reactivate' }}
                                    </v-icon>
                                    <v-tooltip
                                        activator="parent"
                                        location="top"
                                    >
                                        {{ item.status === 'A' ? 'Inactivate User' : 'Activate User' }}
                                    </v-tooltip>
                                </v-btn>
                            </template>
                            <template v-slot:expanded-row="{ columns, item }">
                                <tr>
                                    <td :colspan="columns.length">
                                        <div class="d-flex justify-center">
                                            <v-card style="margin-top: 10px; margin-bottom: 10px; width: 75%;">
                                                <v-data-table-virtual
                                                    :headers="nestedColumns"
                                                    :items="item.roles"
                                                    item-value="role_id"
                                                    fixed-header
                                                    no-data-text="No User Roles"
                                                >
                                                    <template v-slot:[`item.actions`]="{ item }">
                                                        <v-btn icon density="compact" size="large" @click="openDialog(item, 'Role')">
                                                            <v-icon color="blue-grey-darken-4">
                                                                {{ item.status === 'A' ? 'mdi-account-lock' : 'mdi-account-lock-open' }}
                                                            </v-icon>
                                                            <v-tooltip
                                                                activator="parent"
                                                                location="top"
                                                            >
                                                                {{ item.status === 'A' ? 'Inactivate Role' : 'Activate Role' }}
                                                            </v-tooltip>
                                                        </v-btn>
                                                    </template>
                                                </v-data-table-virtual>
                                            </v-card>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </v-data-table-server>
                    </div>
                </v-card>
            </v-row>
        </v-container>
        <v-dialog v-model="dialogInactivate" max-width="500px">
            <v-card>
                <v-card-title class="text-h6">Are you sure to {{ record_state }} this {{ source }}?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="closeDialog">Cancel</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="inactivate">OK</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <NotificationAlert :info="notificationMessage" v-if="showNotification" />
    </v-app>
</template>

<script lang="jsx">
    import ToolBar from '../../components/General/ToolBar.vue';
    import AdaptativeBreadcrumbs from '../../components/General/AdaptativeBreadcrumbs.vue';
    import NotificationAlert from '../../components/General/NotificationAlert.vue';
    import { userService } from '@/services/userService';
    import { userRoleService } from '@/services/userRoleService';
    import { mapGetters } from 'vuex';

    export default {
        name: 'UsersAccess',
        components: {
            ToolBar,
            AdaptativeBreadcrumbs,
            NotificationAlert
        },
        data: () => ({
            dialogInactivate: false,
            userInfo: null,
            record: null,
            state: 'new',
            isModalOpen: false,
            itemsPerPage: 5,
            routes: [
                {
                    title: 'Dashboard',
                    disabled: false,
                    href: '/home'
                },
                {
                    title: 'Access Dashboard',
                    disabled: false,
                    href: '/access'
                },
                {
                    title: 'Users',
                    disabled: true,
                    href: '/access/users'
                }
            ],
            columns: [
                {title: '', key: 'data-table-expand' },
                {title: "#", key: "index", align: 'center', sortable: false, width:"100px"},
                {title: "Fullname", key: "fullname", align: 'center', sortable: false, width:"400px"},
                {title: "Identification", key: 'identification', align: 'center', sortable: false, width:"200px"},
                {title: "E-Mail", key: 'email', align: 'center', sortable: false, width:"200px"},
                {title: "Phone Number", key: 'phonenumber', align: 'center', sortable: false, width:"150px"},
                {title: "Age", key: 'age', align: 'center', sortable: false, width:"125px"},
                {title: "Gender", key: 'gender', align: 'center', sortable: false, width:"125px"},
                {title: "Status", key: 'status', align: 'center', sortable: false, width:"125px"},
                {title: "Actions", key: 'actions', align: 'center', sortable: false, width:"125px"}
            ],
            nestedColumns: [
                { title: "#", key: "index", align: "center", sortable: false },
                { title: "Role", key: "role", align: "center", sortable: false },
                { title: "Status", key: "status", align: "center", sortable: false },
                { title: "Actions", key: "actions", align: "center", sortable: false }
            ],
            identification: null,
            loading: true,
            users: [],
            totalItems: 0,
            search: '',
            itemIndex: -1,
            item: {},
            source: "",
            record_state: "",
            showNotification: false,
            notificationMessage: {}
        }),

        watch: {
            dialogInactivate (val) {
                val || this.closeDialog()
            },
        },

        computed: {
            ...mapGetters('auth', ['getUserData']),
        },

        mounted() {
            this.userInfo = this.getUserData
            this.getAllUsers({ page: 1, itemsPerPage: this.itemsPerPage });
        },

        methods: {
            async getAllUsers({ page, itemsPerPage }){
                try {
                    this.loading = true
                    const search = {
                        identification: this.identification,
                    }

                    const response = await userService.getAllUsers(search, page - 1, itemsPerPage);
                    if (!response.success) {
                        this.$emit('notify', {message: response.message, ok: response.success, show: true});
                    } else {
                        this.totalItems = response.data.pagination.totalElements;
                        this.users = response.data.users.map((user, index) => ({
                            index: index + 1,
                            user_id: user.user_id,
                            fullname: user.fullname,
                            identification: user.identification,
                            email: user.email,
                            phonenumber: user.phonenumber,
                            gender: user.gender,
                            age: user.age,
                            status: user.status,
                            roles: user.roles.map((role, role_index) => ({
                                index: role_index + 1,
                                user_role_id: role.user_role_id,
                                user_id: user.user_id, 
                                role: role.name,
                                status: role.status
                            }))
                        }))
                    }
                } catch (error) {
                    this.$emit('notify', {message: "Error While Searching", ok: false, show: true});
                } finally {
                    this.loading = false;
                }
            },
            cleanFilters(){
                this.identification = null
            },
            openDialog(item, source) {
                this.item = item
                this.dialogInactivate = true
                this.source = source
                this.record_state = this.item.status == 'A' ? 'Inactivate':'Activate'
            },
            async inactivate() {
                this.closeDialog()
                this.loading = true
                try{
                    let response = null                    
                    if(this.source == 'User'){
                        const user = this.users.find(u => u.user_id === this.item.user_id);
                        response = await userService.userActivationControl(user.user_id, this.record_state);
                        
                        if(user){
                            user.status = this.record_state == 'Inactivate' ? 'I':'A'
                        }
                    }
                    
                    if(this.source == 'Role'){
                        const { user_id, user_role_id } = this.item;
                        const user = this.users.find(u => u.user_id === user_id);
    
                        if(user){
                            const role = user.roles.find(r => r.user_role_id === user_role_id);
                            if (role) {
                                response = await userRoleService.roleActivationControl(user_role_id, this.record_state);
                                role.status = this.record_state == 'Inactivate' ? 'I':'A'
                            }
                        }
                    }

                    this.notificationMessage = {
                        message:response.message, 
                        ok:true, 
                        show: true
                    }
                }catch(error){
                    this.notificationMessage = {
                        message:error.response.data.message, 
                        ok:false, 
                        show: true
                    }
                }finally{
                    this.loading = false
                    this.triggerNotification()
                }
            },
            closeDialog() {
                this.dialogInactivate = false
            },
            triggerNotification() {
                this.showNotification = true;
                setTimeout(() => {
                    this.showNotification = false;
                }, 3000);
            }
        }
    }
</script>

<style scoped>
    .table-container {
        max-height: 400px;
        overflow-y: auto;
        overflow-x: auto;
        white-space: nowrap;
    }
</style>
