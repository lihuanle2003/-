<template>
  <InstUserTable :InstData="disAllowInst" :num="0" :btnShow="false" title=""/>
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

  methods: {},
};
</script>
  <style lang="less">
</style>