export default {
    namespaced: true,

    state: {
        token: localStorage.getItem('jwt') || null,
        userData: JSON.parse(localStorage.getItem('userData')) || null,
        permissions: JSON.parse(localStorage.getItem('permissions')) || [],
    },

    mutations: {
        setAuthData(state, { token, userData, permissions }) {
            state.token = token
            state.userData = userData
            state.permissions = permissions

            localStorage.setItem('jwt', token)
            localStorage.setItem('userData', JSON.stringify(userData))
            localStorage.setItem('permissions', JSON.stringify(permissions))
        },

        clearAuthData(state) {
            state.token = null
            state.userData = null
            state.permissions = []

            localStorage.removeItem('jwt')
            localStorage.removeItem('userData')
            localStorage.removeItem('permissions')
        },
    },

    actions: {
        login({ commit }, payload) {
            commit('setAuthData', payload)
        },

        logout({ commit }) {
            commit('clearAuthData')
        },
    },

    getters: {
        isAuthenticated: (state) => !!state.token,
        getToken: (state) => state.token,
        getUserData: (state) => state.userData,
        getPermissions: (state) => state.permissions,
    },
}
