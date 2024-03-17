<template>
  <div class="menu" style="height: 100%">
    <el-menu :default-active="activeIndex" class="el-menu-vertical-demo">
      <h3 class="headerTitle">审核系统</h3>
      <template v-for="(item, index) in routerList">
        <el-menu-item
          :index="String(index)"
          v-if="isShow(item.component)"
          :key="index"
          @click="handleClickChangPAge(item)"
        >
          <i :class="`el-icon-${item.icon}`"></i>
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "@/bus/index";
import { mapState } from "vuex";
import jsCookie from "js-cookie";
export default {
  name: "",
  props: [""],
  data() {
    return {
      activeIndex: "0",
    };
  },

  components: {},

  computed: {
    ...mapState("routerAdd", ["routerList"]),
  },

  created() {},

  mounted() {
    // console.log(this.$store.state);
  },

  methods: {
    handleClickChangPAge(item) {
      this.$router.push(
        { path: item.path },
        () => {},
        () => {}
      );
      bus.$emit("getTitle", item.name);
    },
    isShow(component) {
      // console.log(component);
      if (
        (component === "Loan" || component === "Applic_record/Applic_record") &&
        jsCookie.get("userName") === "admin"
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.menu {
  display: flex;
  flex-flow: column;
  .el-menu {
    flex: 1;
    .headerTitle {
      height: 40px;
      line-height: 40px;
      font-weight: 400px;
      text-align: center;
    }
    .el-menu-item {
      display: flex;
      font-size: 1rem;
      align-items: center;
      padding: 5px;
      user-select: none;
    }
  }
}
</style>