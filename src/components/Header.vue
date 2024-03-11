<template>
  <div class="header">
    <h4>
      {{ title ? title : breadMapper[currentComp]}}
    </h4>
    <el-dropdown @command="handleLoginOut">
      <span class="el-dropdown-link">
        <div class="user">
          <el-avatar
            :size="40"
            src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
          ></el-avatar>
          {{ userName }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </div>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="user">个人中心</el-dropdown-item>
        <el-dropdown-item command="cancel">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import bus from "@/bus/index";
import { logout } from "@/apis/user";
import Cookies from "js-cookie";
import Loan from "@/views/Loan.vue";
export default {
  name: "",
  props: [""],
  data() {
    return {
      title: "",
      userName: "",
      currentComp:"",
      breadMapper:{
        'loan':"贷款申请",
        'home':"首页展示",
        "ApplicationManage":"贷款申请处理",
        "FirstInstance":"一审环节",
        "SecondInstance":"二审环节",
        "Finalinstance":"终审环节",
        "Berejected":"驳回数据",
        "AllowInst":"最终过审人员",
        "Limitofauth":"权限管理"
      }
    };
  },

  components: {},

  computed: {},

  created() {},

  mounted() {
    let ua = window.location.href.split('/')
    this.currentComp = ua[ua.length - 1]
    bus.$on("getTitle", (value) => {
      this.title = value;
    });

    this.userName = Cookies.get("userName");
  },

  methods: {
    // logout退出执行函数
    async handleLoginOut(command) {
      if (command === "cancel") {
        const res = await logout({ userName: this.userName });
        if (res.data.code === 603) {
          Cookies.remove("userName");
          // 退出初始化面包屑数据！
          this.$store.state.bread.breadList = [
            {
              path: "/home",
              title: "home",
            },
          ];
        }
      } else if (command === "user") {
        this.$router.push(
          {
            name: "IndividualCenter",
          },
          () => {},
          () => {}
        );
        this.title = "个人中心";
      }
    },
  },
};
</script>
<style lang="less" scoped>
.header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .user {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 5px;
    span {
      margin-right: 10px;
    }
  }
}
</style>