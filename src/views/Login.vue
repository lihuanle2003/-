<template>
  <div class="form" v-loading="loadStatus">
    <!-- 登录 -->
    <el-form
      v-show="!sign"
      :model="Loginform"
      ref="loginForm"
      :rules="loginFormrules"
    >
      <h3>登 录</h3>
      <el-form-item label="用户名" prop="username">
        <el-input class="input" v-model="Loginform.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          class="input"
          type="password"
          v-model="Loginform.password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
        <el-button @click="sign = true">注册</el-button>
      </el-form-item>
    </el-form>
    <!-- 注册 -->
    <el-form
      v-show="sign"
      :model="signForm"
      ref="signForm"
      :rules="signFormrules"
    >
      <h3>注 册</h3>
      <el-form-item label="用户名" prop="username">
        <el-input class="input" v-model="signForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          class="input"
          type="password"
          v-model="signForm.password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="重新输入密码" prop="rePassword">
        <el-input
          class="input"
          type="password"
          v-model="signForm.rePassword"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSign">提交注册</el-button>
        <el-button @click="sign = false">返回登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { doLogin, userSign} from "@/apis/user";
import Cookies from "js-cookie";

export default {
  name: "",
  props: [""],
  data() {
    let signPasswordValid = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.signForm.password) {
        callback(new Error("俩次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      // 登录表单 验证
      Loginform: {
        username: "",
        password: "",
        loginTime: new Date().toLocaleString(),
      },
      loginFormrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },

      // 注册表单 验证
      signForm: {
        username: "",
        password: "",
        rePassword: "",
        signTime: new Date().toLocaleString(),
      },
      signFormrules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
        rePassword: [
          {
            validator: signPasswordValid,
            trigger: "blur",
          },
        ],
      },

      // 加载状态
      loadStatus: false,

      // 登录| 注册
      sign: false,
    };
  },

  methods: {
    onSubmit() {
      this.$refs.loginForm.validate((valid, data) => {
        if (valid) {
          // 后续添加权限校验
          this.Login(this.Loginform);
        } else {
          console.log(data);
        }
      });
    },

    async Login(Loginform) {
      let res;
      // 加载状态
      this.loadStatus = true;
      try {
        res = await doLogin(Loginform);
      } catch (e) {
        throw new Error();
      }

      // 路由跳转 用户本地信息存储
      if (res.data.code === 200) {
        if(Cookies.get('userName')===Loginform.username){
          // 重复登录账户提示
          this.$message.warning(
            `已经登录了账户${Cookies.get("userName")},不可重复登录`
          );
          this.loadStatus = false;
        }else{
          // console.log(new Date().toLocaleString());
          if (res.data.token !== null) {
            localStorage.setItem("token", res.data.token);
          }
          Cookies.set("online", "online");
          Cookies.set("userName", this.Loginform.username);
          // 存储当前登录用户
          localStorage.setItem(`${this.Loginform.username}`, true);
          this.$store.commit(
            "loginingUser/pushLoginingUser",
            this.Loginform.username
          );
          console.log(this.$store.state.loginingUser.loginingUSer);
          // 将用户对应的路由数据交给vuex进行动态路由加载
          this.$store.commit("routerAdd/LoginChangeRouter", res.data.routerArr);
          this.$store.commit(
            "routerAdd/LoginChangeRouteList",
            res.data.routerArr
          );
          this.loadStatus = false;
          // 路由跳转
          this.$router.replace({ path: "/home" });
        }
      } else if (res.data.code === 607) {
        this.loadStatus = false;
        this.$message({
          type: "info",
          message: res.data.message,
        });
      } else {
        this.loadStatus = false;
        this.$alert("账号或密码错误", "错误", {
          confirmButtonText: "确定",
          callback: (action) => {
            this.$message({
              type: "info",
              message: `action: ${action}`,
            });
          },
        });
      }
    },

    // 注册数据提交函数
    onSign() {
      this.$refs.signForm.validate((valid, data) => {
        if (valid) {
          this.$confirm("是否确认注册用户", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          })
            .then(() => {
              // 执行注册业务
              this.agreeSign();
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消注册",
              });
            });
        }
      });
    },

    /**
     * 同意注册后执行函数
     */
    async agreeSign() {
      let res = await userSign(this.signForm);
      console.log(res);
      if (res.data.code === 200) {
        // 成功注册
        this.$message({
          type: "success",
          message: "注册成功",
        });
        // 跳转登录页面
        this.$confirm("提示", "是否跳转到登录页面", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
          .then(() => {
            this.sign = false;
          })
          .catch(() => {
            this.$message.info("取消");
          });
      } else if (res.data.code === 607) {
        // 存在用户
        this.$message({
          type: "warning",
          message: res.data.message,
        });
      } else {
        // 其他错误
        this.$message({
          type: "error",
          message: "服务器错误",
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.form {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: url(../assets/login_bg.jpg) no-repeat center center;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  .el-form {
    position: absolute;
    width: 300px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 20px;
    border-radius: 5px;
    box-shadow: 2px 2px 2px rgba(69, 69, 69, 0.8);
  }
  .input {
    width: 30%;
    min-width: 200px;
  }
}
</style>