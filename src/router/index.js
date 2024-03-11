import Vue from "vue";
import vueRouter from "vue-router"
import Login from "@/views/Login"
import Cookies from "js-cookie"
import store from "@/store"

Vue.use(vueRouter)
// 配置路由
const router = new vueRouter({
    routes: [
        {
            path: '/',
            component: Login,
        },
        {
            path: "/login",
            name: 'login',
            component: () => import("@/views/Login.vue")
        },
        {
            path: "/message",
            name: "message",
            component: () => import("@/msg/msg.vue")
        },
    ]
})



router.beforeEach((to, from, next) => {
    let online = Cookies.get("online")
    // console.log("路由守卫哦");

    if (!online && to.name !== "login") {
        next("/login")
    } else if (online && to.name === "login") {
        next("/home")
    } else {
        next()
    }

    // console.log(router);
})

router.afterEach((to, from) => {
    if (from.path === "/login" || from.path === "/" || to.path === "/login") return
    store.commit("bread/breadListAdd", { title: to.name, path: to.path })
    store.commit("tableDataGet/getTableData")
})

export default router