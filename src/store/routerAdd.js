import router from "@/router"
import Cookies from "js-cookie"
const routerAdd = {
    namespaced: "true",
    state: {
        // 动态路由数据存放
        routerArr: [],
        // 菜单路由数据
        routerList: [],
        routeAllComponent: [],
        limitMapper: {
            1: "超级管理员",
            2: "终审人员",
            3: "二审人员",
            4: "初审人员",
            5: "普通用户",
        },
    },
    mutations: {
        // 根据后台路由数据 动态生成路由配置对象
        LoginChangeRouter(state, data) {
            state.routerArr = []
            // 将原始数据存入cookies
            Cookies.set("routerData", JSON.stringify(data))
            let routeAarray = []
            data.map(item => {
                // 最外层 router
                let routerObj = {}
                item.path ? routerObj.path = item.path : routerObj.path = null
                item.name ? routerObj.name = item.name : routerObj.name = null
                item.component ? routerObj.component = () => import(`@/views/${item.component}.vue`) : routerObj.component = null
                if (item.children) {
                    routerObj.children = []
                    // 二级路由
                    item.children.map(item => {
                        let child = {}
                        item.path ? child.path = item.path : child.path = null
                        item.name ? child.name = item.name : child.name = null
                        item.component ? child.component = () => import(`@/views/${item.component}.vue`) : child.component = null
                        // 三级路由
                        // if(item.children){

                        // }
                        routerObj.children.push(child)
                    })
                    routerObj.children.push({
                        path: '/IndividualCenter',
                        name: 'IndividualCenter',
                        component: () => import("@/components/IndividualCenter.vue")
                    })
                }
                // console.log(routerObj);
                routeAarray.push(routerObj)
            })
            // 动态注册路由 
            /**
             * home -> childern:[其他子路由]
             */
            routeAarray.map(item => {
                router.addRoute(item)
            })
        },
        LoginChangeRouteList(state, data) {
            // 清空菜单数据源
            state.routerList = []
            data.map(item => {
                if (item.children) {
                    item.children.map(item => {
                        let menuData = {}
                        menuData.name = item.title
                        menuData.path = item.name
                        menuData.icon = item.icon
                        menuData.component = item.component
                        state.routerList.push(menuData)
                    })
                }
            })
            Cookies.set("menu", JSON.stringify(state.routerList))
        }
    }
}

export default routerAdd