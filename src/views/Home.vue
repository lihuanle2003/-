<template>
  <el-container>
    <el-aside width="150px">
      <Menu />
    </el-aside>
    <el-container>
      <el-header>
        <Header />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Main from "@/views/Main.vue";
import Menu from "@/components/Menu.vue";
import Header from "@/components/Header.vue";
export default {
  name: "",
  props: [""],
  data() {
    return {};
  },

  components: {
    Menu,
    Main,
    Header,
  },

  computed: {},

  created() {},

  mounted() {},

  methods: {},
};
</script>
<style lang="less" scoped>
.el-container {
  height: 100vh;
  min-width: 500px;
  min-height: 500px;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  min-height: 50px;
}

.el-aside {
  height: 100vh;
  background-color: #d3dce6;
  color: #333;
  text-align: center;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}
</style>