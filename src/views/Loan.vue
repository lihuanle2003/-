<template>
  <div class="content">
    <div class="user">
      <h4>个人基本信息</h4>

      <el-form :model="userDataForm" :rules="userFormRules" ref="userForm">
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="userDataForm.name"
            placeholder="请输入你的姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="出生日期" prop="birth">
          <el-date-picker
            type="date"
            placeholder="选择你的出生日期"
            v-model="userDataForm.birth"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="userDataForm.sex" placeholder="请选择性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCardNum">
          <el-input
            v-model="userDataForm.idCardNum"
            placeholder="请输入你的省份证号"
          ></el-input>
        </el-form-item>
        <el-form-item label="婚姻状态" prop="maritalStatus">
          <el-select
            v-model="userDataForm.maritalStatus"
            placeholder="请选择婚姻状态"
          >
            <el-option label="已婚" value="已婚"></el-option>
            <el-option label="未婚" value="未婚"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教育状态" prop="edu">
          <el-select v-model="userDataForm.edu" placeholder="请选择教育状态">
            <el-option
              v-for="(item, index) in eduData"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="居住地址" prop="addr">
          <el-input
            v-model="userDataForm.addr"
            placeholder="请输入居住地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="户籍地址" prop="household">
          <el-input
            v-model="userDataForm.household"
            placeholder="请输入户籍地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="居住电话" prop="residentialTelephone">
          <el-input
            v-model="userDataForm.residentialTelephone"
            placeholder="请输入居住电话"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNum">
          <el-input
            v-model="userDataForm.phoneNum"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div class="userWork">
      <h4>职业信息</h4>
      <el-form :model="userWorkData" :rules="userWorkRules" ref="userWork">
        <el-form-item label="现职公司" prop="corporation">
          <el-input
            v-model="userWorkData.corporation"
            placeholder="请输入公司名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="职业" prop="job">
          <el-select v-model="userWorkData.job" placeholder="请选择职业">
            <el-option label="无" value="无"></el-option>
            <el-option label="IT" value="IT"></el-option>
            <el-option label="医疗" value="医疗"></el-option>
            <el-option label="教育" value="教育"></el-option>
            <el-option label="工程" value="工程"></el-option>
            <el-option label="金融" value="金融"></el-option>
            <el-option label="化工" value="化工"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input
            v-model="userWorkData.position"
            placeholder="请输入职位"
          ></el-input>
        </el-form-item>
        <el-form-item label="公司地址" prop="corporationAddr">
          <el-input
            v-model="userWorkData.corporationAddr"
            placeholder="请输入公司地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="公司类型" prop="corporationType">
          <el-input
            v-model="userWorkData.corporationType"
            placeholder="请输入公司类型"
          ></el-input>
        </el-form-item>
        <el-form-item label="公司邮件" prop="corporationEmail">
          <el-input
            v-model="userWorkData.corporationEmail"
            placeholder="请输入公司邮件"
          ></el-input>
        </el-form-item>
        <el-form-item label="公司电话" prop="corporationPhone">
          <el-input
            v-model="userWorkData.corporationPhone"
            placeholder="请输入公司电话"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="submit">
      <el-form>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交数据</el-button>
          <el-button @click="resetAllForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { submitLoanData } from "@/apis/loan";
import { regisPut, regisGet } from "@/apis/user";
import jsCookie from "js-cookie";
export default {
  name: "",
  props: [""],
  data() {
    // 定义自定义校验规则

    // 设置验证规则只需要require与trigger的属性 fun
    let rulesReqAndTri = (
      msg = "请填写信息",
      required = true,
      trigger = "blur"
    ) => {
      return;
    };

    return {
      // 个人信息数据
      userDataForm: {
        name: "",
        birth: "",
        sex: "",
        idCardNum: "",
        maritalStatus: "",
        edu: "",
        addr: "",
        household: "",
        residentialTelephone: "",
        phoneNum: "",
      },
      eduData: ["无", "小学", "初中", "高中", "大学", "硕士"],
      // 个人数据表单验证配置对象
      userFormRules: "",
      // 工作职业信息数据
      userWorkData: {
        corporation: "",
        job: "",
        position: "",
        corporationAddr: "",
        corporationType: "",
        corporationEmail: "",
        corporationPhone: "",
      },
      // 工作职业表单验证对象
      userWorkRules: "",
      // 全部表单数据验证对象
      validAll: {
        userFormValid: false,
        userWorkValid: false,
      },

      // regis
      regis: {
        registration_record: "",
        user: jsCookie.get("userName"),
        submitDate: "",
      },
    };
  },

  components: {},

  computed: {},

  watch: {
    validAll: {
      deep: true,
      handler() {
        let res;
        // 提交确认窗口提示条件判断
        if (
          this.validAll.userFormValid === true &&
          this.validAll.userWorkValid === true
        ) {
          this.$confirm("是否提交数据", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(async () => {
              // 数据清洗
              this.userDataForm.idCardNum = this.userDataForm.idCardNum.replace(
                /\s*/g,
                ""
              );
              this.userDataForm.birth = new Date(
                this.userDataForm.birth
              ).toLocaleDateString();
              // 执行传递表单数据操作
              res = await submitLoanData({
                userInfo: this.userDataForm,
                userWorkInfo: this.userWorkData,
              });
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "提交成功",
                });
                this.validAll.userFormValid = false;
                this.validAll.userFormValid = false;

                // 执行用户提交记录业务
                this.regisFun(this.resetAllForm);
                // 重置表单
              } else if (res.data.code === 605) {
                this.$message({
                  type: "error",
                  message: "身份信息存在",
                });
                this.validAll.userFormValid = false;
                this.validAll.userFormValid = false;
              }
            })
            .catch(() => {
              // 取消提交修改验证对象状态
              this.validAll.userFormValid = false;
              this.validAll.userFormValid = false;
              this.$message({
                type: "info",
                message: "取消提交",
              });
            });
        }
      },
    },
  },

  mounted() {
    // 刷新时重置验证对象状态
    this.validAll.userFormValid = false;
    this.validAll.userFormValid = false;
    console.log();
  },

  created() {
    // 从vuex拿到验证规则
    this.userFormRules = this.$store.state.validData.userFormRules;
    this.userWorkRules = this.$store.state.validData.userWorkRules;
  },

  methods: {
    onSubmit() {
      this.validAll.userFormValid = false;
      this.validAll.userWorkValid = false;
      // userForm 表单验证 改变validAll 触发watch监听 执行提交请求操作
      this.$refs["userForm"].validate((valid) => {
        if (valid) {
          this.validAll.userFormValid = true;
        } else {
          this.validAll.userFormValid = false;
          return false;
        }
      });

      // userWork 表单验证
      this.$refs["userWork"].validate((valid) => {
        if (valid) {
          this.validAll.userWorkValid = true;
        } else {
          this.validAll.userWorkValid = false;
          return false;
        }
      });

      // console.log(this.validAll);
    },

    // 重置表单
    resetAllForm() {
      this.$refs["userForm"].resetFields();
      this.$refs["userWork"].resetFields();
    },

    // 用户申请记录入库
    async regisFun(callback) {
      // 组装临时对象  使用唯一值 身份证号作为外键
      this.regis.registration_record = this.userDataForm.idCardNum;
      this.regis.submitDate = new Date().toLocaleString();

      await regisPut(this.regis);

      this.resetAllForm();
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  .user,
  .userWork {
    background-color: white;
    padding: 20px;
    margin-bottom: 10px;
  }
}

.el-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .el-form-item {
    display: flex;
    flex-flow: column;
    align-items: start;
    width: 22%;
  }
}

.submit {
  height: 200px;
  .el-form {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>