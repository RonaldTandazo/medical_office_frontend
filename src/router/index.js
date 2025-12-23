import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/Authentication/AuthenticationPage.vue";
import LoginForm from "../components/Authentication/LoginForm.vue";
import SignUpForm from "../components/Authentication/SignUpForm.vue";
import RecoveryPage from "@/views/Recovery/RecoveryPage.vue";
import RecoveryForm from "../components/Authentication/RecoveryForm.vue";
import ResetPasswordForm from "@/components/Authentication/ResetPasswordForm.vue";
import SuccessComponent from "@/components/General/SuccessComponent.vue";
import DashboardPage from "@/views/DashboardPage.vue";
import AccountDashboard from "@/views/Account/AccountDashboard.vue";
import AccountInformation from "@/views/Account/AccountInformation.vue";
import PatientsDashboard from "@/views/Patients/PatientsDashboard.vue";
import PatientsList from "@/views/Patients/PatientsList.vue";
import ScheduleAppoinment from "@/views/Patients/ScheduleAppoinment.vue";
import MedicationsDashboard from "@/views/Medications/MedicationsDashboard.vue";
import MedicationsList from "@/views/Medications/MedicationsList.vue";
import AccessDashboard from "@/views/Access/AccessDashboard.vue";
import UsersAccess from "@/views/Access/UsersAccess.vue";
import GenerateRecipe from "@/views/Patients/GenerateRecipe.vue";
import MedicationUpload from "@/views/Provider/MedicationUpload.vue"
import ProviderDashboard from "@/views/Provider/ProviderDashboard.vue";
import ProviderUploads from "@/views/Provider/ProviderUploads.vue";

const routes = [
  {
    path: "/",
    component: HomePage,
    children: [
      {
        path: "",
        redirect: "login",
      },
      {
        path: "login",
        name: "LoginForm",
        component: LoginForm,
      },
      {
        path: "signup",
        name: "SignUp",
        component: SignUpForm,
      }
    ],
  },
  {
    path: "/recovery",
    component: RecoveryPage,
    children: [
      {
        path: "",
        name: "RecoveryForm",
        component: RecoveryForm,
      },
      {
        path: "reset_password",
        name: "ResetPassword",
        component: ResetPasswordForm,
        props: (route) => ({ token: route.query.token }),
      },
    ],
  },
  {
    path: "/success",
    name: "Success",
    component: SuccessComponent,
    props: true,
  },
  {
    path: "/home",
    name: 'Home',
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/account",
    component: AccountDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: "/account/information",
    component: AccountInformation,
    meta: { requiresAuth: true },
    name: "AccountInformation"
  },
  {
    path: "/patients",
    component: PatientsDashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/patients/list",
    component: PatientsList,
    meta: { requiresAuth: true },
  },
  {
    path: "/patients/schedule_appointment",
    component: ScheduleAppoinment,
    meta: { requiresAuth: true },
  },
  {
    path: "/patients/generate_recipe",
    component: GenerateRecipe,
    meta: { requiresAuth: true },
  },
  {
    path: "/medications",
    component: MedicationsDashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/medications/list",
    component: MedicationsList,
    meta: { requiresAuth: true },
  },
  {
    path: "/access",
    component: AccessDashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/access/users_access",
    component: UsersAccess,
    meta: { requiresAuth: true },
  },
  {
    path: "/provider/upload",
    component: MedicationUpload
  },
  {
    path: "/provider",
    component: ProviderDashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/provider/uploads",
    component: ProviderUploads,
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const token = localStorage.getItem("jwt");
    if (!token) {
      next({ name: "LoginForm" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
