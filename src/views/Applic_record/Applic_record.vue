<template>
  <!-- 申请记录页面 -->
  <div>
    <div class="applic_container">
      <!-- 记录列表 -->
      <div class="record_list" v-loading="leftIsShow">
        <div class="record_list_header">
          <div class="header_tip"></div>
        </div>
        <div class="mask" v-if="applic_record_info.length === 0">暂无数据</div>
        <div class="record_body">
          <div
            class="record"
            v-for="(item, index) in applic_record_info"
            :key="index"
            @click="currentRecord(item.registration_record)"
          >
            <span> 身份证id: </span>
            {{ item.registration_record }}
            <br />
            <span> 申请时间: </span>
            {{ new Date(item.submitDate).toLocaleString() }}

            <div class="tip"></div>
          </div>
        </div>
        <div class="bottom_tip el-icon-arrow-down"></div>
      </div>
      <!-- 记录详情 -->
      <div class="record_info" v-loading="rightIsShow">
        <div class="info_header">
          {{ record_info_data ? record_info_data[0].id : "暂无数据" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { regisGet, getRecordInfoByID } from "@/apis/user";
import { mapState } from "vuex";
import throttle from "../../tools/throttle";

let res = null;

export default {
  name: "Applic_record",
  props: [""],
  data() {
    return {
      applic_record_info: "",
      record_info_data: "",
      timer: null,
      delay: 300,
      rightIsShow: false,
      leftIsShow: false,
    };
  },
  methods: {
    throttle,
    /**
     * 拿到当前用户贷款申请的记录
     */
    async getRecordList() {
      this.leftIsShow = true;
      let res = await regisGet({ current_username: this.current_username });
      if (res.data.code === 200) {
        // 存储记录
        this.applic_record_info = res.data.data;
      } else {
        this.$message.warning("数据请求失败");
      }
      this.leftIsShow = false;
    },
    currentRecord(key) {
      this.rightIsShow = true;
      if (!this.timer) {
        this.timer = setTimeout(async () => {
          res = await getRecordInfoByID({ key });
          if (res.data.code === 200) {
            this.record_info_data = res.data.data;
            console.log(this.record_info_data);
          } else {
            console.log("数据获取出错");
          }
          this.timer = null;
          this.rightIsShow = false;
        }, this.delay);
      }
    },
    changeLoad() {
      this.isLoad = true;
      return "暂无数据";
    },
  },
  mounted() {
    // console.log(this.$store.state.current_login_user.current_username);
    this.getRecordList();
  },
  computed: {
    ...mapState("current_login_user", ["current_username"]),
  },
};
</script>
<style scoped lang="less">
.applic_container {
  display: flex;
  width: 100%;
  min-width: 800px;
  padding: 10px;
  background-color: rgba(230, 230, 230, 0.9);
  opacity: 0.7;
  box-shadow: 2px 2px 2px gray;
  .record_list,
  .record_info {
    height: 400px;
    flex: 1;
  }
  .record_body {
    height: 90%;
    overflow: scroll;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: rgba(89, 132, 213, 0.8);
    background: rgba(255, 255, 255, 1);
    padding: 10px;
    border-radius: 10px;
  }
  .record_list {
    position: relative;
    margin-right: 20px;
    overflow: scroll;
    overflow-x: hidden;
    overflow-y: hidden;
    .record_list_header {
      position: relative;
      height: 10px;
      width: 50%;
      transform: translateX(50%);
      padding: 3px;

      @colorbl: blue;
      @colorred: red;
      .header_tip {
        position: relative;
        left: 0;
        background: @colorbl;
        width: 10%;
        height: 100%;
        transition: all 0.5s;
        animation: block_move 3s linear infinite;
        border-radius: 5px;
      }
      @keyframes block_move {
        0% {
          left: 0;
          background: @colorbl;
        }
        50% {
          left: 100%;
          background: @colorred;
        }
        100% {
          left: 0;
          background: @colorbl;
        }
      }
    }
    .mask {
      text-align: center;
      margin-top: 30px;
    }
    .bottom_tip {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 10px;
      animation: jump_tip 1s linear infinite;
      color: #0077ff;
      font-size: 18px;

      &:hover{
        color: #ff0000;
      }

      @keyframes jump_tip {
        0% {
          transform: translateX(-50%) translateY(-30%);
        }
        50% {
          transform: translateX(-50%) translateY(10%);
        }
        100% {
          transform: translateX(-50%) translateY(-30%);
        }
      }
    }
  }
  .record_info {
    background-color: rgba(255, 255, 255, 0.7);
    .info_header {
    
    }
  }
}

.record {
  position: relative;
  border-bottom: 1px solid black;
  margin: 10px 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: rgba(93, 112, 147, 0.8);
  padding: 10px;
  color: white;
  border-radius: 5px;
  transition: all 0.5s;

  span {
    color: black;
    font-weight: 700;
    user-select: none;
  }

  .tip {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 10px;
    height: 10px;
    background: #c60000;
    border-radius: 50%;
  }
  &:hover {
    background: #acacac;
  }

  &:hover .tip {
    animation: tip linear 0.3s;
  }
  @keyframes tip {
    0% {
      transform: translateY(-3px);
    }
    50% {
      transform: translateY(3px);
    }
    100% {
      transform: translateY(0px);
    }
  }
}
</style>