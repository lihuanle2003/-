import Vuex from "vuex"
import Vue from "vue"

Vue.use(Vuex)

import routerAdd from "./routerAdd"
import bread from "./bread"
import validData from "./tableDataToValid"
import examine from "./examine"
import tableDataGet from "./tableDataGet"
import loginingUser from './loginUser'
import current_login_user from "./current_login_user"

const store = new Vuex.Store({
    modules:{
        routerAdd,
        bread,
        validData,
        examine,
        tableDataGet,
        loginingUser,
        current_login_user
    }
})

export default store