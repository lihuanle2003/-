<template>
  <InstUserTable
    :InstData="disAllowInst"
    :num="0"
    :btnShow="false"
    title=""
    ref="InstBereject"
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

  watch: {
    
  },

  created() {},

  mounted() {
    this.disAllowInst = this.$store.state.tableDataGet.disAllowInst;
  },

  methods: {
  },
};
</script>
  <style lang="less">
</style>