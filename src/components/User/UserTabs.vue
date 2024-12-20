<template>
    <div class="d-flex flex-row">
        <v-tabs v-model="tab" color="primary" direction="vertical">
            <v-tab
                prepend-icon="mdi-account"
                text="Personal Information"
                value="1"
            ></v-tab>
            <v-tab 
                prepend-icon="mdi-lock" 
                text="Account" 
                value="2"
            ></v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab" class="flex-grow-1">
            <v-tabs-window-item value="1">
                <v-card 
                    flat 
                    style="padding: 0px 5px 10px 5px;"
                    :disabled="loading"
                    :loading="loading"
                >
                    <template v-slot:loader="{ isActive }">
                        <v-progress-linear
                            :active="isActive"
                            color="blue-accent-2"
                            height="3"
                            indeterminate
                        ></v-progress-linear>
                    </template>
                    <v-row>
                        <v-col>
                            <v-avatar color="grey-darken-1" size="120" :class="disabled ? 'avatar' : 'pointer'" @click="triggerFileInput">
                                <v-img :src="avatarUrl" alt="User Avatar" cover v-if="avatarUrl"></v-img>
                                <v-icon icon="mdi-account" v-else size="60"></v-icon>
                            </v-avatar>
                            <input type="file" ref="fileInput" class="d-none" @change="onFileSelected" :disabled="disabled"/>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field
                            v-model="userInfo.username"
                            label="Fullname"
                            prepend-icon="mdi-badge-account"
                            variant="solo"
                            density="comfortable"
                            :disabled="disabled"
                            ></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field
                            v-model="userInfo.email"
                            label="E-mail"
                            prepend-icon="mdi-email"
                            variant="solo"
                            density="comfortable"
                            :disabled="true"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field
                                v-model="userInfo.identification"
                                label="ID Card"
                                prepend-icon="mdi-card-account-details"
                                variant="solo"
                                density="comfortable"
                                :disabled="disabled"
                            ></v-text-field>
                        </v-col>
                        <v-col>
                            <v-select
                                v-model="userInfo.gender"
                                prepend-icon="mdi-gender-male"
                                :items="genders"
                                item-title="label"
                                item-value="value"
                                label="Gender"
                                variant="solo"
                                density="comfortable"
                                :disabled="disabled"
                                clearable
                            ></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <div class="text-start ms-14" style="color: grey; font-size:13px;">
                                Age
                            </div>
                            <v-slider
                                v-model="userInfo.age"
                                :min="18"
                                :max="65"
                                :step="1"
                                prepend-icon="mdi-calendar-range"
                                :thumb-size="15"
                                thumb-label
                                :disabled="disabled"
                            ></v-slider>
                        </v-col>
                        <v-col>
                            <v-text-field
                                v-model="userInfo.phonenumber"
                                prepend-icon="mdi-phone"
                                label="Phone Number"
                                variant="solo"
                                density="comfortable"
                                :disabled="disabled"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="d-flex justify-end">
                            <v-btn
                                v-if="!isEditing"
                                prepend-icon="mdi-file-document-edit"
                                color="blue-accent-2"
                                @click="disabledEdit"
                            >
                                Edit
                            </v-btn>
                            <div v-else>
                                <v-btn
                                    prepend-icon="mdi-close-circle"
                                    color="black"
                                    class="me-2"
                                    @click="cancelEdit"
                                >
                                    Cancel
                                </v-btn>
                                <v-btn
                                    prepend-icon="mdi-content-save"
                                    color="blue-accent-2"
                                    @click="updateUserInformation"
                                >
                                    Save
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>
                </v-card>
            </v-tabs-window-item>
            <v-tabs-window-item value="2">
                <v-card flat style="padding: 0px 0px 25px 0px;">
                    <ResetPasswordForm></ResetPasswordForm>
                </v-card>
            </v-tabs-window-item>
        </v-tabs-window>
    </div>
</template>
<script>
    import ResetPasswordForm from '../Authentication/ResetPasswordForm.vue';
    import { userService } from "../../services/userService";
    import { mapGetters } from 'vuex';
    
    export default {
        components: {
            ResetPasswordForm
        },
        data: () => ({
            tab: "1",
            disabled: true,
            isEditing: false,
            loading: false,
            userInfo: {},
            genders: [
                {
                    label: "Male",
                    value: "M",
                },
                {
                    label: "Female",
                    value: "F"
                }
            ],
            avatarUrl: null
        }),
       
        computed: {
            ...mapGetters('auth', ['getUserData']),
        },

        mounted() {
            this.userInfo = this.getUserData
        },

        methods: {
            disabledEdit(){
                this.isEditing = true;
                this.disabled = false;
            },
            cancelEdit() {
                this.isEditing = false;
                this.disabled = true;
                this.loading = false;
            },
            triggerFileInput() {
                this.$refs.fileInput.click();
            },
            onFileSelected(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.avatarUrl = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            },
            async updateUserInformation(){
                this.userInfo.avatar = this.avatarUrl
                try{
                    this.loading = true;
                    const response = await userService.updateUserInformation(this.userInfo);

                    this.$emit('notify', {message:response.message, ok:response.success, show: true});
                }catch(error){
                    this.$emit('notify', {message:"Failed at Updating", ok:false, show: true});
                }finally{
                    this.cancelEdit()
                }
            }
        },  
    };
</script>

<style scoped>
    .d-none {
        display: none;
    }
    .pointer {
        cursor: pointer;
    }
    .avatar {
        opacity: 0.5;
    }
    .v-img {
        object-fit: cover;
    }
</style>

