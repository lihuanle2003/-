<template>
  <InstUserTable
    :InstData="fallinyInstData"
    :reGetTableData="reGetTableData"
    :num="3"
    :btnShow="true"
    title="终审"
  />
</template>

<script>
import InstUserTable from "@/components/InstUserTable.vue";
export default {
  name: "",
  props: [""],
  data() {
    return {
      fallinyInstData: [],
    };
  },

  components: {
    InstUserTable,
  },

  computed: {},

  created() {},

  mounted() {
    this.fallinyInstData = this.$store.state.tableDataGet.fallinyInstData;
  },

  methods: {
    reGetTableData() {
      this.$store.commit("tableDataGet/getTableData");
      this.fallinyInstData = this.$store.state.tableDataGet.fallinyInstData;
    },
  },
};
</script>
<style lang="less">
.el-card__body {
  padding: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.el-card__body:nth-child(n + 1) {
  flex: 1;
}
.userInfo,
.useraddr {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-right: 20px;
  border-right: 1px solid gray;
}

.button {
  padding: 15px;
}
</style>