import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import router from "./router"
import store from "./store"
import Cookies from 'js-cookie';
import InstUserTableVue from './components/InstUserTable.vue';


Vue.use(ElementUI)
// 关闭生产提示
Vue.config.productionTip = false

Vue.component(InstUserTableVue)

const app = new Vue({
  render: h => h(App),
  router,
  store,
  created() {
    // 检测账户登录情况
    this.checkIsLogin(Cookies.get('userName'))
    // console.log(this.$router);
  },
  beforeDestroy() {
    Cookies.remove("menu")
  },
  mounted() {
  
  },

  methods: {
    checkIsLogin(userName) {
      // let url = window.location.href.split('/')
      // console.log(url[url.length - 1]);
      // 刷新时注册路由 防止刷新时白屏
      if (Cookies.get("menu")) {
        let routerData = JSON.parse(Cookies.get("routerData"))
        store.commit("routerAdd/LoginChangeRouter", routerData)
        store.commit("routerAdd/LoginChangeRouteList", routerData)

        // 获取表格 并进行审核状态分组
        this.$store.commit("tableDataGet/getTableData")
        // 更新vuex validData数据
        this.$store.commit("validData/addValid");
      }
    }
  }
})

app.$mount('#app')
