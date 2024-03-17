<template>
  <div class="tal">
    <!-- container -->
    <div class="container" @click="handleCancel">
      <template v-for="item in login_user">
        <div
          class="item"
          v-if="item.userName !== 'admin'"
          :key="item.id"
          @click="handleEdit(item, $event)"
        >
          <div class="avatar">
            <span class="userName">
              {{ item.userName }}
            </span>
            <div class="online">
              <span :class="item.online === 1 ? 'tag green' : 'tag red'">
              </span>
              <span>
                {{ item.online === 1 ? "在线" : "离线" }}
              </span>
            </div>
          </div>
          <div class="info">
            <div class="loginInfo">
              <div>
                <span style="font-weight: 700"> 注册时间: </span>
                <span style="color: rgb(7, 125, 131)">
                  {{ new Date(item.signTime).toLocaleString() }}
                </span>
              </div>
              <div>
                <span style="font-weight: 700"> 上次登录: </span>
                <span style="color: rgb(7, 125, 131)">
                  {{ new Date(item.lastLoginTime).toLocaleString() }}
                </span>
              </div>
              <div>
                <span style="font-weight: 700"> 权限等级: </span>
                <span>
                  {{ limitMapper[item.limits] }}
                </span>
              </div>
            </div>
          </div>
          <div class="control">
            <el-button type="primary" plain @click="handleEdit(item, $event)"
              >更改权限</el-button
            >
            <el-button
              type="danger"
              plain
              :disabled="showEdit"
              @click="handleDelete($event)"
              >删除用户</el-button
            >
          </div>
        </div>
      </template>
    </div>

    <!-- edit -->
    <transition name="edit">
      <div class="edit" v-show="showEdit" ref="edit">
        <!-- @mousedown="handleMouseDown($event)" -->
        <!-- :style="{
          transform: `translate(${position.x}px,${position.y}px)`,
        }" -->
        <div class="herder">
          <h3>权限编辑</h3>
        </div>
        <!-- body -->
        <div class="editBody">
          <div class="editItem">
            目标账户:<span style="color: rgb(64, 64, 64)">
              {{ editUser }}
            </span>
          </div>
          <div class="editItem">
            权限等级 :
            <el-select
              v-model="editLimit"
              placeholder="请选择"
              @change="silderChange"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-slider
              v-model="editLimit"
              :max="Object.keys(limitMapper).length"
              @change="silderChange"
            ></el-slider>
          </div>
          <div class="editItem">
            显示页面 :
            <div class="check" style="margin-top: 10px">
              <!-- 全选 -->
              <el-checkbox v-model="checkAll" @change="handleCheckAllChange"
                >全选</el-checkbox
              >
              <div style="margin: 10px 0"></div>
              <!-- 选项 选中的数据存于CheckedRoutes中-->
              <el-checkbox-group
                v-model="checkedRoutes"
                @change="handleCheckedRoutesChange"
              >
                <template v-for="item in routeAllComponent">
                  <el-checkbox
                    v-if="item === 'Home' ? false : true"
                    :label="item"
                    :key="item"
                    >{{ getChinaName(item) }}</el-checkbox
                  >
                </template>
              </el-checkbox-group>
              <div class="checkButton">
                <el-button type="danger" plain @click="resetCheckedRoutes"
                  >重 置</el-button
                >
              </div>
            </div>
          </div>
          <div class="editItem">
            <div class="submitBtn">
              <el-button type="info" plain @click="handleSubmit"
                >提交</el-button
              >
              <el-button type="info" plain @click="handleCancel"
                >取消</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- createUser -->
    <div class="createUser">
      <span class="el-icon-plus" @click="createUser"> 创建新用户</span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getLoginUser, updateUserLimit } from "../../apis/user";
export default {
  data() {
    return {
      login_user: "",

      showEdit: false,

      // 更改的limit
      editLimit: 0,
      editUser: "",

      // 权限选择
      options: [
        { label: "超级管理员", value: 1 },
        { label: "终审人员", value: 2 },
        { label: "二审人员", value: 3 },
        { label: "初审人员", value: 4 },
        { label: "普通用户", value: 5 },
        { label: "封禁用户", value: 0 },
      ],

      // 是否全选
      checkAll: false,
      // 已选择数据
      checkedRoutes: [],
      // 数据
      routes: [],
      checkedUser: "",

      // 存储变更前的属性
      dataBeforeChange: {},
      beforeLimit: "",
    };
  },
  methods: {
    // 获取可选权限数据
    async getList() {
      let res = await getLoginUser();
      if (res.status === 200) {
        this.login_user = res.data.data;
        this.$store.state.routerAdd.routeAllComponent = res.data.routesArr;
        // console.log("请求返回的数据:\n",res.data.routesArr);
      } else {
        this.$message.error("请求失误");
      }
    },

    // edit
    handleEdit(item, e) {
      // 阻止事件冒泡
      e.stopPropagation();
      this.checkedUser = item.userName;
      this.editUser = item.userName;
      this.editLimit = Number(item.limits); // 转换Number为滚动条数据
      this.showEdit = true;
      // 改变全选框状态
      if (this.editLimit === 1) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
      this.checkedRoutes = item.allowComponent.split(",");
      // 将编辑的数据进行存储 在提交前验证是否变更
      this.dataBeforeChange = {
        editLimit: this.editLimit,
        checkedRoutes: this.checkedRoutes,
      };
      this.beforeLimit = item.editLimit;
    },

    // delete
    handleDelete(e) {
      // 阻止事件冒泡
      e.stopPropagation();
      console.log("删除用户");
    },

    // createUser
    createUser() {
      this.showEdit = false;
    },

    // 复选框全选事件
    handleCheckAllChange(val) {
      this.checkedRoutes = val ? this.routeAllComponent : [];
    },

    // 复选框选中事件
    handleCheckedRoutesChange(value) {
      let checkedCount = value.length;
      // 是否选中为全选
      this.checkAll = checkedCount === this.routeAllComponent.length;
    },

    // 重置选中路由
    resetCheckedRoutes() {
      this.checkAll ? (this.checkAll = false) : undefined;
      this.checkedRoutes = [];
    },

    // 拿到权限定义的routeList
    getRoutesByLimit(limit) {
      let needroutes = [];

      // 判断权限拿到需要的路由
      if (limit === 1) {
        this.checkAll = true;
        return this.routeAllComponent;
      } else {
        this.checkAll = false;
        if (limit === 5) {
          needroutes = ["Home", "Main", "Loan"];
        } else if (limit === 4) {
          needroutes = ["Home", "FirstInstance", "AllowInst", "Main"];
        } else if (limit === 3) {
          needroutes = ["Home", "Main", "SecondInstance", "AllowInst"];
        } else if (limit === 2) {
          needroutes = [
            "Home",
            "Main",
            "Finalinstance",
            "AllowInst",
            "Berejected",
          ];
        } else {
          return [];
        }
      }
      return needroutes;
    },

    /**
     * 提交事件
     */
    async handleSubmit() {
      // 对比当前权限数据是否变更
      let list1 = this.dataBeforeChange.checkedRoutes;
      let list2 = this.checkedRoutes;
      let routesName1 = [];
      let routesName2 = [];
      /**
       * 验证已选和默认是否相同 相同提价不通过
       */
      const compareRoutes = () => {
        list1.forEach((item) => {
          routesName1.push(item.component);
        });

        list2.forEach((item) => {
          routesName2.push(item.component);
        });
        let isSame = true;
        if (this.beforeLimit !== this.editLimit) {
          isSame = false;
        }
        if (routesName1.length === routesName2.length) {
          routesName1.forEach((item) => {
            // 存在元素在已选择中找不到 则数组不相同
            if (routesName2.indexOf(item) === -1) {
              isSame = false;
            }
          });
        } else {
          // 长度不一样，数组不一样
          isSame = false;
        }

        return isSame;
      };

      // 选择与默认存在变更，通过提交逻辑
      if (!compareRoutes()) {
        // 拿到权限限制的路由数组
        let needCopmonent = [];
        this.checkedRoutes.map((item) => {
          // 防止异常数据
          if (this.routeAllComponent.indexOf(item) !== -1) {
            needCopmonent.push(item);
          }
        });

        // 请求api提交数据
        let res = await updateUserLimit({
          needCopmonent,
          userName: this.checkedUser,
        });
        if (res.data.code === 200) {
          this.$message.success("权限更新成功");
          // 更改默认数据
          this.dataBeforeChange.checkedRoutes = this.checkedRoutes;
        } else {
          this.$message.warning("请求出错");
        }
      } else {
        this.$message.info("数据没有变更，提交失败");
      }
    },

    // 关闭编辑页面 取消编辑
    handleCancel() {
      if (this.showEdit) {
        this.showEdit = false;
        this.$message.info("取消编辑");
      }
    },

    // 得到复选框的中文
    getChinaName(item) {
      let mark;
      this.routerList.forEach((i, index) => {
        if (i.component == item) {
          mark = this.routerList[index].name;
        }
      });
      return mark;
    },

    silderChange(value) {
      this.checkedRoutes = this.getRoutesByLimit(value);
    },

    // edit拖拽实现函数 功能太傻逼了 还得练
    //#region
    // handleMouseDown(event) {
    //   this.ismove = true;
    //   this.startX = event.clientX - parseInt(this.$refs.edit.offsetLeft);
    //   this.startY = event.clientY - parseInt(this.$refs.edit.offsetTop);
    //   document.addEventListener("mousemove", this.handleMouseMove);
    //   document.addEventListener("mouseup", this.handleMouseUp);
    // },
    // handleMouseMove(event) {
    //   if (this.ismove) {
    //     const offsetX = event.clientX - this.startX;
    //     const offsetY = event.clientY - this.startY;

    //     this.position.x += offsetX;
    //     this.position.y += offsetY;

    //     this.startX = event.clientX;
    //     this.startY = event.clientY;
    //   }
    // },
    // handleMouseUp() {
    //   this.ismove = false
    //   document.removeEventListener("mousemove", this.handleMouseMove);
    //   document.removeEventListener("mouseup", this.handleMouseUp);
    // },
    // #endregion
  },
  mounted() {
    // 获取用户数据
    this.getList();
  },
  computed: {
    ...mapState("routerAdd", [
      "routeAllComponent",
      "routerList",
      "limitMapper",
    ]),
  },
  watch: {},
};
</script>
<style scoped lang="less">
.tal {
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(40, 136, 233, 0.5);
  }
  ::-webkit-scrollbar-track {
    background: rgb(255, 255, 255);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 125, 251, 0.8);
  }
}

.tal {
  width: 100%;
  height: 100%;
  display: flex;
  overflow-x: hidden;
  position: relative;
  .container {
    position: relative;
    flex: 1;
    height: 100%;
    overflow: scroll;
    overflow-x: hidden;
    display: flex;
    flex-wrap: wrap;
    // 平分间距
    align-content: flex-start;
    align-items: start;
    margin-right: 15px;
    transition: width 0.5s ease;
    padding-bottom: 20px;
    .item {
      display: flex;
      flex-direction: column;
      height: 23%;
      flex: 1;
      min-width: 250px;
      max-width: 284px;
      min-height: 170px;
      border: 0.5px solid #f56c6c;
      border-radius: 5px;
      box-shadow: 2px 2px 4px rgb(170, 197, 238);
      padding: 5px;
      margin: 60px 20px;
      margin-top: 0;
      .avatar {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 0.5px solid #409eff;
        padding: 5px;
        .userName {
          width: 40%;
          min-width: 80px;
          text-shadow: 2px 2px 2px rgba(114, 114, 114, 0.5);
          font-weight: 700;
        }
        .online {
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          font-size: 12px;
          .tag {
            display: block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
          }
          .red {
            background-color: rgb(255, 0, 0);
          }
          .green {
            background-color: rgb(0, 255, 0);
          }
        }
      }
      .info {
        flex: 2;
        width: 100%;
        .loginInfo {
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: center;
          align-content: flex-start;
          padding: 10px;
          font-size: 14px;
          text-align: center;
          border-bottom: 0.5px solid #409eff;
        }
      }
      .control {
        height: 32px;
        width: 100%;
        display: flex;
        justify-content: end;
        margin-top: 8px;
      }

      .item:hover {
        box-shadow: 3px 3px 4px rgb(60, 123, 216);
      }
    }
  }
  .edit {
    width: 25%;
    height: 100%;
    min-width: 180px;
    background-color: rgba(228, 246, 255, 0.5);
    padding: 10px;
    border-radius: 10px;
    .herder {
      text-align: center;
      padding-bottom: 3px;
      border-bottom: 1px solid black;
      margin-bottom: 10px;
      user-select: none;
    }

    .editBody {
      width: 100%;
      padding: 5px;
      .editItem {
        font-weight: 700;
        margin-bottom: 10px;
        .el-select {
          width: 100%;
          margin-top: 5px;
        }
        .check {
          width: 100%;
          background-color: white;
          padding: 5px;
          > .el-checkbox {
            width: 100%;
            border-bottom: 2px solid #409eff;
            padding-bottom: 5px;
          }
          .el-checkbox-group {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            padding: 0 5px;
            .el-checkbox {
              margin-right: 5px;
              width: 100%;
              padding: 3px 0;
              border-bottom: 1px solid #409eff;
            }
          }

          .checkButton {
            width: 100%;
            display: flex;
            justify-content: space-evenly;
            margin-top: 10px;
          }
        }
        .submitBtn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          .el-button {
            width: 40%;
            color: white;
            background-color: rgba(40, 136, 233, 0.5);
            transition: all 0.5s;
            &:hover {
              background-color: rgba(0, 125, 251, 0.8);
            }
          }
        }
      }
    }
  }

  .createUser {
    position: fixed;
    display: flex;
    bottom: 3%;
    left: 50%;
    transform: translateX(-50%);
    background: #409eff;
    border-radius: 10px;
    color: #f2f6fc;
    transition: all 0.3s;
    span {
      display: block;
      width: 100%;
      height: 100%;
      margin: 15px;
      user-select: none;
    }
    :hover {
      color: #d6a7c5;
    }
  }
}

.el-button {
  padding: 8px 5px;
}

.edit-enter-active,
.edit-leave-active {
  transition: all 0.3s ease;
}
.edit-enter,
.edit-leave-to {
  transform: translate(300px, 0);
  opacity: 0;
}
.edit-leave,
.edit-enter-to {
  transform: translate(0);
  opacity: 1;
}
</style>