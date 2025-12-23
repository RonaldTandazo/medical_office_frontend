export default {
    namespaced: true,
    state: {
        userData: JSON.parse(localStorage.getItem('userData')) || {},
        permissions: JSON.parse(localStorage.getItem('permissions')) || [],
    },
    mutations: {
        setUserData(state, userData) {
            state.userData = userData;
            localStorage.setItem('userData', JSON.stringify(userData));
        },
        setPermissions(state, permissions) {
            state.permissions = permissions;
            localStorage.setItem('permissions', JSON.stringify(permissions));
        },
        clearAuthData(state) {
            state.userData = {};
            state.permissions = [];
            localStorage.removeItem('userData');
            localStorage.removeItem('permissions');
            localStorage.removeItem('jwt');
        },
    },
    actions: {
        login({ commit }, { userData, permissions }) {
            commit('setUserData', userData);
            commit('setPermissions', permissions);
        },
        logout({ commit }) {
            commit('clearAuthData');
        },
    },
    getters: {
        getUserData: (state) => state.userData,
        getPermissions: (state) => state.permissions,
    },
};
  