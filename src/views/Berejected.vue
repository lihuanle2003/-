<template>
  <InstUserTable
    :reGetTableData="reGetTableData"
    :InstData="disAllowInst"
    :num="0"
    :btnShow="false"
    title=""
  />
</template>
  
  <script>
import InstUserTable from "@/components/InstUserTable.vue";
export default {
  name: "",
  props: [""],
  data() {
    return {
      disAllowInst: [],
    };
  },

  components: {
    InstUserTable,
  },

  computed: {},

  created() {},

  mounted() {
    this.disAllowInst = this.$store.state.tableDataGet.disAllowInst;
  },

  methods: {
    // 重新获取数据
    reGetTableData() {
      this.$store.commit("tableDataGet/getTableData");
      this.disAllowInst = this.$store.state.tableDataGet.disAllowInst;
    },
  },
};
</script>
  <style lang="less">
</style>