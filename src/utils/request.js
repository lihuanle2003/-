import axios from "axios"
import router from "@/router"
import { Notification, Message } from "element-ui"
import Cookies from "js-cookie"

const request = axios.create(
    {
        // api前缀
        baseURL: "/api",
        // 请求超时时间
        timeout: 10000
    }
)

// 请求拦截器 请求发送之前进行的业务处理
request.interceptors.request.use(config => {
    // 给header添加token
    return config
})
// 响应拦截器
request.interceptors.response.use(response => {
    // 成功响应 返回数据
    if (response?.data?.code === 2000) {
        if (typeof response?.data?.data === "string") {
            Message.success(response?.data?.data)
        }
        if (typeof response?.data?.data?.info === "string") {
            Message.success(response?.data?.data?.info)
        }
        return response
    } else if (response?.data.code === 603) {
        // console.log("请求拦截器");
        // 错误响应进行错误提示
        Notification.error({
            title: '错误',
            message: `${response.data.message}`
        })
        // 获取当前页面的url
        let url = window.location.href.split("/")
        // 判断页面是否在login页面 不在则进行跳转
        if (url[url.length - 1] !== "login") {
            localStorage.removeItem("token")
            Cookies.remove("online");
            Cookies.remove("menu");
            Cookies.remove("routerData");
            Cookies.remove("userName")
            router.replace({ name: "login" })
        }
    } else {
        if (response?.status !== 200) {
            Notification.error({
                title: "错误",
                message: "响应错误"
            })
        }
    }
    return response
})

export default request