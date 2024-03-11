<template>
  <div class="wranInfo">
    当前用户权限不足，无法访问该页面
  </div>
</template>

<script>

  export default {
    name:'',
    props:['infoType','message'],
    data () {
      return {

      };
    },
    methods: {},

  }

</script>
<style scoped>
.wranInfo{
  width: 200px;
  height: fit-content;
  margin: 0 auto;
  font-size: 24px;
}
</style>