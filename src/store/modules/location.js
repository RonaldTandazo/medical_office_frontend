export default {
    namespaced: true,
    state: {
        locatedMenu: JSON.parse(localStorage.getItem('locatedMenu')) || {}
    },
    mutations: {
        setLocatedMenu(state, menu) {
            state.locatedMenu = menu;
            localStorage.setItem('locatedMenu', JSON.stringify(menu));
        },
    },
    actions:{
        located({ commit }, menu) {
            commit('setLocatedMenu', menu);
        },
    },
    getters: {
        getLocatedMenu: (state) => state.locatedMenu
    },
};
  