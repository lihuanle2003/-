<template>
  <div>
    <!-- 搜索框 -->
    <el-input
      placeholder="请输入内容"
      v-model="inputData"
      class="input-with-select"
      style="margin-bottom: 20px"
    >
      <el-select v-model="select" slot="prepend" placeholder="请选择">
        <el-option
          v-for="(item, index) in selectOption"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button
        slot="append"
        @click="submitsearch"
        icon="el-icon-search"
        @keydown.enter="submitsearch"
      ></el-button>
    </el-input>
    <el-empty
      v-show="dataToShow.length === 0"
      description="最终过审数据暂无"
    ></el-empty>
    <!-- 数据列表 -->
    <el-descriptions v-for="(item, index) in dataToShow" :key="index">
      <el-descriptions-item label="姓名">{{ item.name }}</el-descriptions-item>
      <el-descriptions-item label="电话号码">{{
        item.phoneNum
      }}</el-descriptions-item>
      <el-descriptions-item label="性别">{{ item.sex }}</el-descriptions-item>
      <el-descriptions-item label="居住地址">{{
        item.addr === "" ? "未知" : item.addr
      }}</el-descriptions-item>
      <el-descriptions-item label="教育水平">
        {{ item.edu === "" ? "未知" : item.edu }}
      </el-descriptions-item>
      <el-descriptions-item label="备注">
        <el-tag size="small" type="success"> 申请成功 </el-tag>
      </el-descriptions-item>
    </el-descriptions>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="page_size"
      :total="allowInst.length"
      :current-page="1"
      @current-change="handleChangePage"
    >
    </el-pagination>
  </div>
</template>
  
  <script>
export default {
  name: "",
  props: [""],
  data() {
    return {
      allowInst: [],
      dataToShow: [],
      page_size: 6,

      inputData: "",
      selectOption: [
        {
          label: "1",
          value: 1,
        },
        {
          label: "2",
          value: 2,
        },
      ],
      select: "",
    };
  },

  components: {},

  computed: {},

  created() {},

  mounted() {
    this.$store.commit("tableDataGet/getTableData");
    this.getDataFromStote();
  },

  methods: {
    // 拿到数据 并且切割数据
    getDataFromStote() {
      this.allowInst = this.$store.state.tableDataGet.allowInst;
      this.sliceDataToShow(0, this.page_size);
    },
    handleChangePage(page) {
      if (page > 0) {
        let str = -this.page_size + this.page_size * page;
        let end = 0 + this.page_size * page;
        this.sliceDataToShow(str, end);
      }
    },

    // 切割函数
    sliceDataToShow(str, end) {
      this.dataToShow = this.allowInst.slice(str, end);
    },

    // 搜索事件
    submitsearch() {
      let input = this.inputData;
      if (input) {
        this.dataToShow = this.allowInst.filter((item) => {
          let values = Object.values(item);
          let status = 0;
          values.forEach((value) => {
            if (value == input) {
              status = 1;
            }
          });
          if (status) {
            return item;
          }
        });
        console.log(this.dataToShow);
      } else {
        this.dataToShow = this.allowInst.slice(0, this.page_size);
      }
    },
  },
};
</script>
  
<style lang="less">
.el-descriptions {
  margin-bottom: 30px;
}
.el-descriptions__body {
  padding: 10px;
  padding-bottom: 2px;
}
</style>