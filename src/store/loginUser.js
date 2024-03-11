export default {
    namespaced: true,
    state: {
        loginingUSer: undefined
    },
    mutations: {
        pushLoginingUser(state, value) {
            state.loginingUSer = value
        },
        delLoiningUser(state) {
            state.loginingUSer = undefined
        }
    }
}