<template>
  <router-view />
</template>

<script>
import tokenVerfiy from "@/apis/token";
import jsCookie from "js-cookie";
export default {
  name: "App",
  methods: {
    async tokenVerfiyFun() {
      // token存在  请求服务器验证token
      let token = localStorage.getItem("token");
      let res = await tokenVerfiy(token);
      // console.log(localStorage.getItem("token"));
      // console.log(res);
    },
  },
  mounted() {
    this.tokenVerfiyFun();
  },
};
</script>

<style lang="less">
.el-main{
  ::-webkit-scrollbar {
    width: 10px;
    height: 8px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(40, 136, 233, 0.5);
  }
  ::-webkit-scrollbar-track {
    background: rgb(255, 255, 255);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 125, 251, 0.8);
  }
}
.el-table .cell {
  text-align: center;
}

.el-form-item {
  width: 70%;
  display: flex;
  flex-flow: column;
  justify-content: space-evenly;
  .el-form-item__label {
    text-align: left;
  }
  .el-form-item__content{
    display: flex;
    justify-content: space-evenly;
  }
}

.el-pagination {
  position: absolute;
  bottom: 10px;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(-50%);
}
</style>
