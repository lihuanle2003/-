<template>
  <div>
    <!-- 搜索框 -->
    <el-autocomplete
      placeholder="请输入内容 可以使用key---value形式实现精准查找"
      v-model="inputData"
      class="input-with-select"
      style="margin-bottom: 20px; width: 100%"
      :fetch-suggestions="querySearch"
      :trigger-on-focus="true"
      clearable
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
        @keydown.enter="submitsearch"
        icon="el-icon-search"
      ></el-button>
    </el-autocomplete>

    <!-- 数据表单 -->
    <el-table
      border
      :data="searcTDToshow"
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <template v-for="(item, index) in columns">
        <el-table-column
          :key="index"
          v-if="item === 'aduitStatus' ? false : true"
          :prop="item === 'id' ? 'uid' : item"
          :label="colNamChina[item] ? colNamChina[item] : 'null'"
          :width="idCardOrPhoneWidth(item)"
        >
        </el-table-column>
      </template>
      <!-- 审核状态 -->
      <el-table-column label="审核状态" width="120px">
        <template slot-scope="tag">
          <el-tag :type="tagType(tag.row.aduitStatus)">{{
            tagMessage(tag.row.aduitStatus)
          }}</el-tag>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column v-if="restatus" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="
              handleEdit(scope.$index, scope.row), (dialogFormVisible = true)
            "
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- dialog -->
    <el-dialog
      title="编辑信息"
      width="60%"
      :visible.sync="dialogFormVisible"
      center
    >
      <el-form inline :model="form" :rules="dialogVialib" ref="dialogForm">
        <template v-for="(item, index) in formLabel">
          <!-- 正常输入字段 -->
          <el-form-item
            v-if="showDialogIfNeed(item)"
            :key="index"
            :label="colNamChina[item] ? colNamChina[item] : 'null'"
            label-width="120px"
            :prop="item"
          >
            <el-input v-model="form[item]" autocomplete="off"></el-input>
          </el-form-item>
          <!-- birth -->
          <el-form-item
            v-if="item === 'birth' ? true : false"
            :key="index"
            :label="colNamChina[item]"
            label-width="120px"
          >
            <el-date-picker
              type="date"
              placeholder="选择你的出生日期"
              v-model="form[item]"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <!-- sex -->
          <el-form-item
            v-if="item === 'sex' ? true : false"
            :key="index"
            :label="colNamChina[item]"
            prop="sex"
            label-width="120px"
          >
            <el-select v-model="form[item]" placeholder="请选择性别">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <!-- job -->
          <el-form-item
            v-if="item === 'job' ? true : false"
            :key="index"
            :label="colNamChina[item]"
            prop="job"
            label-width="120px"
          >
            <el-select v-model="form[item]" placeholder="请选择职业">
              <el-option label="无" value="无"></el-option>
              <el-option label="IT" value="IT"></el-option>
              <el-option label="医疗" value="医疗"></el-option>
              <el-option label="教育" value="教育"></el-option>
              <el-option label="工程" value="工程"></el-option>
              <el-option label="金融" value="金融"></el-option>
              <el-option label="化工" value="化工"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-form>

      <div
        slot="footer"
        class="dialog-footer"
        style="display: flex; align-items: center; justify-content: center"
      >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分页器 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="page_size"
      :total="searcTableData.length"
      :current-page="currentPage"
      @current-change="handleChangePage"
    >
    </el-pagination>

    <div class="batchPro">
      <transition name="el-zoom-in-bottom">
        <!-- 一个数据展示编辑按钮 -->
        <el-button
          v-show="checkBoxData.length === 1"
          type="primary"
          @click="
            handleEdit(findDaIndInSeaTD(checkBoxData[0].uid), checkBoxData[0]),
              (dialogFormVisible = true)
          "
        >
          编辑
        </el-button>
      </transition>
      <transition name="el-zoom-in-bottom">
        <el-button v-show="checkBoxData.length > 0" type="danger">
          删除
        </el-button>
      </transition>
    </div>
  </div>
</template>

<script>
import { getLoanData, updateLoanData } from "@/apis/loan";
export default {
  name: "",
  props: [""],
  data() {
    return {
      // 响应数据状态
      restatus: false,
      // 搜索数据
      inputData: "",
      columns: [],
      // 表格数据
      tableData: [],
      searcTableData: [],
      searcTDToshow: [],
      // 筛选配置对象
      selectOption: [
        {
          label: "姓名",
          value: 1,
        },
        {
          label: "地址",
          value: 2,
        },
      ],
      select: "",
      dialogFormVisible: false,

      // dialog弹框数据
      form: {},
      formLabel: [],
      dialogVialib: {},
      valibData: [],

      // 编辑的数据下标
      editDataIndex: "",

      // 列名 中
      colNamChina: {
        uid: "序号",
        name: "姓名",
        birth: "出生日期",
        sex: "性别",
        idCardNum: "身份证号码",
        addr: "地址",
        phoneNum: "手机号码",
        corporation: "公司",
        job: "工作",
        corporationPhone: "公司电话",
      },
      // ky反转过后的列名
      repeatColNAmeL: {},

      tagValues: ["0", "1", "2", "3", "4"],

      // dialog弹框需要展示的列数据
      dialogCommon: [
        "name",
        "idCardNum",
        "addr",
        "phoneNum",
        "corporation",
        "corporationPhone",
      ],

      // 加载状态
      loading: true,

      // 分页器数据
      currentPage: 1,
      page_size: 8,

      // 定义长字段以及需要的宽度对象
      longItemWithWidth: {
        idCardNum: 200,
        phoneNum: 150,
        uid: 50,
        job: 50,
        sex: 50,
      },

      // 复选框数据
      checkBoxData: [],
    };
  },

  components: {},

  computed: {},
  watch: {
    select(newVal, oldVal) {
      console.log(newVal);
    },
    searcTDToshow: {
      deep: true,
      handler() {
        console.log("页面更新");
      },
    },
  },

  created() {},

  mounted() {
    this.getTableList(this.submitsearch);
    this.$store.commit("validData/addValid");
    this.dialogVialib = this.$store.state.validData.applicationManageWithValid;
    this.repeatColNAmeLFun();
  },

  methods: {
    /**
     * 获取table数据api
     * 1.拿到服务器数据 res
     * 2.res数据存在 添加uid序列属性
     * 3.设置显示的colums列属性
     */
    async getTableList(callback) {
      let res;
      try {
        res = await getLoanData();
      } catch (e) {
        this.$message({
          type: "error",
          message: res,
        });
      }
      if (res.data.code === 200) {
        this.restatus = true;
        let dataList = res.data.data.tableData;
        let i = 1;
        // 为每项添加uid属性 处理日期数据格式问题
        dataList.map((item) => {
          item.uid = i;
          item.birth = new Date(item.birth).toLocaleDateString();
          i++;
        });
        this.tableData = dataList;
        // 获取列
        let col = res.data.data.columns;
        // 获取需要验证的列
        let colToview = this.getViaShowData();
        col.map((item, index) => {
          // 判断是否存在于校验数据
          if (colToview.indexOf(item) != -1) {
            if (this.columns.indexOf(item) === -1) {
              this.columns.push(item);
            }
          }
        });
        // 不存在aduitStatus 添加aduitStatus
        if (this.columns.indexOf("aduitStatus") === -1) {
          this.columns.push("aduitStatus");
        }
        // 添加uid数据
        if (this.columns.indexOf("uid") === -1) {
          this.columns.unshift("uid");
        }
        // 获取到数据后 动态改变dialog弹框数据
        this.columns.map((item) => {
          // 不显示id aduitStatus 不允许修改id属性
          if (item === "id" || item === "aduitStatus") {
            return;
          }
          // dialog表单添加数据对象
          this.form[item] = "";
          if (this.formLabel.indexOf(item) === -1) {
            this.formLabel.push(item);
          }
        });

        // 执行初始搜索回调
        callback();
      } else if (res.data.code === 605) {
        this.restatus = false;
        this.$message({
          type: "error",
          message: res.data.message,
        });
      }
    },

    /**
     * 搜索事件
     *  1.未输入 return
     *  2.输入 遍历table 拿到每一行item的所有列属性data
     *    遍历data转换为字符串数据
     *    判断输入元素是否在data中 存在返回item
     */
    submitsearch() {
      this.loading = true;
      // 拿到拆分好的Map数据
      let m = this.amendInputData(this.inputData);
      if (typeof m === "object" && m.size) {
        new Promise((resolved, reject) => {
          this.searchFun([...m.values()], [...m.keys()]);
          resolved();
        }).then((value) => (this.loading = false));
      } else {
        let input = this.inputData.replace(/\s*/g, "");
        // 没有输入内容时
        if (input === "") {
          this.searcTableData = this.tableData;
          this.searcTDToshow = this.searcTableData.slice(0, this.page_size);
          this.loading = false;
          return;
        }
        this.searchFun(input);
      }
    },
    // 输入关键字拆分
    amendInputData(keyword) {
      let m;
      if (keyword.includes("---") || keyword.includes(":")) {
        m = new Map();
        let arr;
        if (keyword.includes("---")) {
          arr = keyword.split("---");
          arr.forEach((item) => {
            let r1 = item.split(":");
            m.set(r1[0], r1[1]);
          });
        } else {
          arr = keyword.split(":");
          m.set(arr[0], arr[1]);
        }
      }
      // 返回Map数据 或者 搜索string
      return m;
    },

    // 搜索配合函数 执行关键字搜索业务
    searchFun(keyword) {
      let data;
      let args = arguments;
      new Promise((resolved, reject) => {
        this.searcTableData = this.tableData.filter((item, index) => {
          data = Object.values(item);
          let result;
          for (let i = 0; i < data.length; i++) {
            data[i] = String(data[i]);
          }
          if (index + 1 === this.tableData.length) {
            this.loading = false;
          }
          if (
            data.indexOf(typeof keyword == "object" ? keyword[0] : keyword) !==
            -1
          ) {
            result = item;

            // 区分普通查询与精准查询
            if (args.length >= 2) {
              // 重新记录
              result = false;
              for (let i = 0; i < args[0].length; i++) {
                let inputData = args[0][i];
                let validValue = item[this.repeatColNAmeL[args[1][i]]];
                if (inputData === validValue) {
                  result = item;
                } else {
                  result = false;
                }
              }
            }
          }

          // console.log(result);
          return result;
        });
        resolved(this.searcTableData);
      }).then((value) => {
        if (!value.length) {
          this.$message.warning("没有找到对应数据");
        }
        this.searcTDToshow = this.searcTableData.slice(0, this.page_size);
      });
    },
    /**
     * 编辑触发函数
     * @param {行位置} index
     * @param {行对象} row
     */
    handleEdit(index, row) {
      // 编辑功能 数据传递
      this.editDataIndex = index;
      this.form = { ...row };
      // console.log(row);
    },
    /**
     * 操作-> 删除触发函数
     * @param {*} index
     * @param {*} row
     *
     */
    handleDelete(index, row) {
      // console.log(this.form);
      this.$confirm("此操作将删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.tableData.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      this.dialogClose();
    },

    // 编辑提交触发函数
    handleSubmit() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          // dialog验证正确进行更改操作
          if (this.editDataIndex !== "") {
            // vue无法检测数组元素的变化
            // this.searcTableData[this.editDataIndex] = this.form;
            // 使用$set方法进行数组元素的更改 实现页面响应
            if (this.form.uid) {
              delete this.form.uid;
            }
            this.$set(this.searcTableData, this.editDataIndex, this.form);
            this.form.birth = new Date(this.form.birth).toLocaleDateString();
            // console.log(this.form.birth);
            this.updateSqlData(this.form);
          }
          this.dialogClose();
        } else {
          this.$message({
            type: "warning",
            message: "填入数据有误!",
          });
        }
      });
    },

    /**
     * 更新数据库信息
     */
    async updateSqlData(data) {
      let res = await updateLoanData(data);
      // 服务器返回 605 数据库存在重复数据
      if (res.data.code === 605) {
        this.$message.error(res.data.message);
      } else if (res.data.code === 200) {
        this.$message.success(res.data.message);
      }

      // 刷新数据 因为 uid数据有bug mlgb的 不想解决了
      this.getTableList(this.submitsearch);
    },
    /**
     * dialog表单关闭 执行的处理函数
     */
    dialogClose() {
      this.dialogFormVisible = false;
    },
    /**
     * 拿到需要展示[验证]数据的keys
     */
    getViaShowData() {
      let keys = Object.keys(this.dialogVialib);
      return keys;
    },

    /**
     *  列名 转换 英转中
     *  拿到keys
     */
    TranColNaToCh(colname) {
      let keys = Object.keys(this.colNamChina);
      let index = keys.indexOf(colname);
      if (index != -1) {
        return this.colNamChina.colname;
      }
    },
    /**
     * 根据审核状态值 改变tag样式
     * @param {审核状态值} aduitStatus
     */
    tagType(aduitStatus) {
      if (aduitStatus === "0") {
        return;
      } else if (aduitStatus === "1") {
        return "success";
      } else if (aduitStatus === "2") {
        return "warning";
      } else if (aduitStatus === "3") {
        return "success";
      } else {
        return "danger";
      }
    },

    /**
     * tag 信息
     */
    tagMessage(aduitStatus) {
      if (aduitStatus === "0") {
        return "等待审核";
      } else if (aduitStatus === "1") {
        return "一审通过";
      } else if (aduitStatus === "2") {
        return "二审通过";
      } else if (aduitStatus === "3") {
        return "终审通过";
      } else {
        return "已被驳回";
      }
    },

    /**
     * 分页器改变触发函数
     */
    handleChangePage(page) {
      if (page > 0) {
        let str = -this.page_size + this.page_size * page;
        let end = 0 + this.page_size * page;
        this.searcTDToshow = this.searcTableData.slice(str, end);
      } else {
        this.searcTDToshow = this.searcTableData.slice(0, this.page_size);
      }
    },

    // 为长字段数据指定宽度
    idCardOrPhoneWidth(item) {
      if (Object.keys(this.longItemWithWidth).indexOf(item) !== -1) {
        return this.longItemWithWidth[item];
      } else {
        return 100;
      }
    },

    // 弹窗表单展示内容控制
    showDialogIfNeed(item) {
      if (this.dialogCommon.indexOf(item) !== -1) {
        return true;
      } else {
        return false;
      }
    },

    /**
     * 复选框改变触发事件
     */
    handleSelectionChange(value) {
      this.checkBoxData = value;
    },

    /**
     * searchTableData内寻找对象下标
     * @param {Number} index 对象uid属性
     */
    findDaIndInSeaTD(index) {
      let ind;
      if (index) {
        this.searcTableData.forEach((item, i) => {
          if (item.uid === index) {
            ind = i;
          }
          return;
        });

        return ind;
      }
    },
    /**
     * 搜索框 搜索建议
     */
    querySearch(queryString, callback) {
      let result = [];
      let tempResult;
      if (queryString) {
        tempResult = this.tableData.filter((item) => {
          let values = Object.values(item);
          let status = 0;
          values.forEach((item) => {
            if (queryString === String(item)) {
              status = 1;
              return;
            }
          });
          if (status) return item;
        });

        for (let i = 0; i < tempResult.length; i++) {
          result.push({
            value: `姓名:${tempResult[i].name}---性别:${tempResult[i].sex}`,
          });
        }
      } else {
        result = [];
      }
      callback(result);
    },

    repeatColNAmeLFun() {
      let obj = {};
      for (let key in this.colNamChina) {
        if (!obj.hasOwnProperty(key)) {
          obj[this.colNamChina[key]] = key;
        }
      }
      this.repeatColNAmeL = obj;
    },
  },
};
</script>
<style lang="less">
.el-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.batchPro {
  position: fixed;
  bottom: 10px;
  left: 20%;
}
</style>