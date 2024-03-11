<template>
  <div>
    <el-card> </el-card>
    <el-empty
      v-if="InstData.length === 0 ? true : false"
      description="暂无数据"
    ></el-empty>
    <el-card
      v-if="dataToShow.length > 0 ? true : false"
      style="margin-bottom: 10px"
    >
      <div class="userInfo">
        <span class="el-icon-s-custom">
          <!-- 还需要展示更多数据 -->
          姓名
        </span>
        <span class="el-icon-phone"> 电话号码 </span>
        <span class="el-icon-male"> 性别 </span>
      </div>
      <div class="useraddr">
        <span class="el-icon-map-location"> 地址 </span>
        <span> 身份证号 </span>
      </div>
      <div class="button">
        <span>操作</span>
      </div>
    </el-card>
    <el-row
      v-for="(item, index) in dataToShow"
      :key="index"
      style="margin-bottom: 10px"
      v-loading="loadstatus"
    >
      <el-col>
        <el-card>
          <div class="userInfo">
            <span>
              <!-- 还需要展示更多数据 -->
              {{ item.name }}
            </span>
            <span>
              {{ item.phoneNum }}
            </span>
            <span>
              {{ item.sex }}
            </span>
          </div>
          <div class="useraddr">
            <span>
              {{ item.addr }}
            </span>
            <span>
              {{ item.idCardNum }}
            </span>
          </div>
          <div class="button">
            <el-button
              type="primary"
              @click="success(item.id, item.name)"
              icon="el-icon-check"
              plain
              >通过</el-button
            >
            <el-button
              v-if="btnShow"
              type="danger"
              @click="noArgee(item.id, item.name)"
              icon="el-icon-circle-close"
              plain
              >驳回</el-button
            >
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="page_size"
      :total="InstData.length"
      :current-page="currentPage"
      @current-change="handleChangePage"
    >
    </el-pagination>
  </div>
</template>

<script>
import { firstInstSuccess, firstInstNoArgee } from "@/apis/submitInst";
export default {
  name: "InstUserTable",
  props: ["InstData", "btnShow", "title", "num"],
  data() {
    return {
      page_size: 6,
      currentPage: 1,
      searchTableData: [],

      // 展示数据
      dataToShow: [],

      // 加载状态
      loadstatus: true,
    };
  },

  components: {},

  computed: {},

  created() {},

  mounted() {
    // 放如任务队列 靠后执行 等待vuex ajax微任务执行完成后执行
    setTimeout(() => {
      this.getData();
    }, 0);
  },

  methods: {
    getData() {
      this.sliceDataToShow(0, this.page_size);
    },
    /**
     * 驳回操作
     */
    noArgee(id, name) {
      this.$confirm(`是否驳回${name}的${this.title}请求`, "驳回请求", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await firstInstNoArgee({ id, status: 4 });
          if (res.data.code === 200) {
            this.$store.commit("tableDataGet/getTableData");
            this.$message({
              type: "success",
              message: "驳回成功",
            });
          } else if (res.data.code === 605) {
            this.$message({
              type: "error",
              message: "服务器错误",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消",
          });
        });
    },

    /**
     * 同意操作
     */
    success(id, name) {
      this.$confirm(`是否通过${name}的${this.title}请求`, "通过请求", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await firstInstSuccess({ id, status: this.num });
          if (res.data.code === 200) {
            this.$store.commit("tableDataGet/getTableData");
            this.$message({
              type: "success",
              message: "审核通过",
            });
          } else if (res.data.code === 605) {
            this.$message({
              type: "error",
              message: "服务器错误",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消",
          });
        });
    },

    // 分页函数
    handleChangePage(page) {
      if (page > 0) {
        let str = -this.page_size + this.page_size * page;
        let end = 0 + this.page_size * page;
        this.sliceDataToShow(str, end);
      } else {
        this.sliceDataToShow(0, this.page_size);
      }
    },
    // 切割函数
    sliceDataToShow(str, end) {
      this.dataToShow = this.InstData.slice(str, end);
      this.loadstatus = false;
    },
  },
};
</script>
<style lang="less" scoped>
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
  min-width: 250px;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-right: 20px;
  border-right: 1px solid gray;
}

.button {
  display: flex;
  width: 20%;
  min-width: 140px;
  justify-content: space-around;
  align-items: center;
  padding: 15px;
  .el-button{
    padding: 10px 5px;
    box-shadow: 2px 2px 4px rgb(225, 225, 225);
  }
}
</style>