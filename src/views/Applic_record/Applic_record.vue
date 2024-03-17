<template>
  <!-- 申请记录页面 -->
  <div>
    <div class="applic_container">
      <!-- 记录列表 -->
      <div class="record_list" v-loading="leftIsShow">
        <div class="record_list_header">
          <div :class="{ header_tip: true, move_up_down: isVibraation }"></div>
        </div>
        <div class="mask" v-if="applic_record_info.length === 0">暂无数据</div>
        <div
          class="record_body"
          @scroll="record_body_scrollEmt"
          ref="record_body"
        >
          <div
            class="record"
            v-for="(item, index) in applic_record_info"
            :key="index"
            @click="
              currentRecord(
                {
                  idCardNum: item.idCardNum,
                  sex: item.sex,
                },
                index
              )
            "
          >
            <span> 身份证id: </span>
            {{ item.idCardNum }}
            <br />
            <span> 申请时间: </span>
            {{ new Date(item.submitDate).toLocaleString() }}

            <div v-if="item.isread ? true : false" class="tip"></div>
          </div>
        </div>
        <div
          class="bottom_tip jump el-icon-arrow-down"
          v-show="isShow_bottom_tip"
        ></div>
        <div class="bottom_tip no_more" v-show="!isShow_bottom_tip">
          没有更多了
        </div>
      </div>
      <!-- 记录详情 -->
      <div class="record_info" v-loading="rightIsShow">
        <!-- record_info mask无数据时的遮罩层 -->
        <div class="record_info_mask" v-if="record_info_isShow">
          选择左侧数据查看信息
        </div>
        <div class="left_regis_data_show" v-if="!record_info_isShow">
          <span class="regis_list"> <i>姓名:</i>{{ getData("name") }} </span>
          <span class="regis_list">
            <i>身份证号码:</i>{{ getData("idCardNum") }}
          </span>
          <span class="regis_list">
            <i>居住地址:</i>{{ getData("addr") }}
          </span>
          <span class="regis_list">
            <i>手机号码:</i>{{ getData("phoneNum") }}
          </span>
          <span class="regis_list">
            <i>出生日期:</i>{{ getData("birth") }}
          </span>
          <span class="regis_list messageInfo">
            <i>备注信息:</i>
            <el-input
              type="textarea"
              :value="messageInfo ? messageInfo : '暂无备注'"
            ></el-input>
          </span>
        </div>
        <el-steps
          v-if="!record_info_isShow && getData('aduitStatus') != '4'"
          :space="250"
          :active="Number(getData('aduitStatus'))"
          finish-status="success"
          :align-center="true"
        >
          <el-step title="一审"></el-step>
          <el-step title="二审"></el-step>
          <el-step title="终审"></el-step>
          <el-step title="通过"></el-step>
        </el-steps>
        <el-steps
          v-if="!record_info_isShow && getData('aduitStatus') == '4'"
          :space="250"
          :active="Number(getData('aduitStatus'))"
          finish-status="error"
          :align-center="true"
        >
          <el-step title="驳回"></el-step>
        </el-steps>
      </div>
    </div>
    <div class="applic_bottom"></div>
  </div>
</template>

<script>
import { regisGet, getRecordInfoByID } from "@/apis/user";
import { mapState } from "vuex";
import throttle from "../../tools/throttle";
import { gsap } from "gsap/gsap-core";
import echarts from "echarts";
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
      isShow_bottom_tip: true,
      record_info_isShow: true,

      // header_tip 是否跳转动画
      isVibraation: false,
      messageInfo: "",
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

    /**
     * 选中申请记录列表触发数据 发送请求获取数据
     */
    currentRecord(obj, index) {
      this.rightIsShow = true;
      this.record_info_isShow = false;
      if (!this.timer) {
        this.timer = setTimeout(async () => {
          // 选中拉取数据 修改未读状态
          res = await getRecordInfoByID(obj);
          if (res.data.code === 200) {
            // 正确返回结果 存数据 改状态
            this.record_info_data = res.data.data;
            console.log(res.data.messageInfo[0]["message_info"]);
            this.messageInfo = res.data.messageInfo[0]["message_info"];
            // 修改点击的数据阅读状态
            this.applic_record_info[index].isread = 0;
          } else {
            console.log(res);
            console.log("数据获取出错");
          }
          this.timer = null;
          this.rightIsShow = false;
        }, this.delay);
      }
    },
    /**
     * record_body 滚动触发事件
     */
    record_body_scrollEmt(e) {
      // console.log(e.target.scrollTop); // 滚动高度
      // console.log(e.target.parentNode); // 父节点
      // console.log(e.target.clientHeight); //视口高度
      // console.log(e.target.scrollHeight); // 元素内容高度

      // 判断是否滚动到底部，判断滚动高度加上视口高度是否等于元素内容高度即可
      const element = e.target;
      if (
        Math.ceil(element.scrollTop) + element.clientHeight >=
        element.scrollHeight
      ) {
        this.isShow_bottom_tip = false;
      } else if (Math.floor(element.scrollTop) <= 0) {
        this.isVibraation = true;
      } else {
        //
        if (this.isShow_bottom_tip) return;
        this.isShow_bottom_tip = true;
        this.isVibraation = false;
      }
    },

    // right 展示数据
    getData(item) {
      return this.record_info_data[0]
        ? item == "birth"
          ? new Date(this.record_info_data[0][item]).toLocaleDateString()
          : this.record_info_data[0][item]
        : "数据暂时不存在";
    },

    initCharts() {
      this.echarts1 = echarts.init(document.querySelector(".applic_bottom"));
      this.echarts1.setOption({
        title: {
          text: "申请数据",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "Email",
            type: "line",
            stack: "Total",
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: "Union Ads",
            type: "line",
            stack: "Total",
            data: [220, 182, 191, 234, 290, 330, 310],
          },
          {
            name: "Video Ads",
            type: "line",
            stack: "Total",
            data: [150, 232, 201, 154, 190, 330, 410],
          },
          {
            name: "Direct",
            type: "line",
            stack: "Total",
            data: [320, 332, 301, 334, 390, 330, 320],
          },
          {
            name: "Search Engine",
            type: "line",
            stack: "Total",
            data: [820, 932, 901, 934, 1290, 1330, 1320],
          },
        ],
      });
    },
  },
  mounted() {
    this.getRecordList();
    this.initCharts()
  },
  computed: {
    ...mapState("current_login_user", ["current_username"]),
  },
};
</script>
<style scoped lang="less">
.el-steps {
  width: 80%;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
.applic_container {
  display: flex;
  width: 100%;
  min-width: 700px;
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
    padding: 10px;
    border-radius: 10px;
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background: rgb(255, 255, 255);
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: rgba(40, 136, 233, 0.5);
      border-radius: 10px;
      transition: all 0.5s;
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color: rgba(0, 125, 251, 0.8);
    }
  }
  .record_list {
    position: relative;
    margin-right: 20px;
    overflow: scroll;
    overflow-x: hidden;
    overflow-y: hidden;
    .record_list_header {
      position: absolute;
      left: 50%;
      height: 10px;
      padding: 2px;
      width: 30%;
      @colorbl: rgb(27, 171, 255);
      @colorred: red;
      transform: translateX(-50%);
      z-index: 999;
      .header_tip {
        position: relative;
        left: 50%;
        background: @colorbl;
        width: 20%;
        height: 100%;
        transition: all 0.5s;
        border-radius: 5px;
        transform: translateX(-50%);
      }
      .move_up_down {
        animation: move_up_down 0.5s linear;
        @keyframes move_up_down {
          0% {
            transform: translateX(-50%) translateY(0%);
          }
          25% {
            transform: translateX(-50%) translateY(-70%);
          }
          50% {
            transform: translateX(-50%) translateY(0);
          }
          75% {
            transform: translateX(-50%) translateY(70%);
          }
          100% {
            transform: translateX(-50%) translateY(0);
          }
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
      margin-top: 5px;
      color: #0077ff;
      transform: translateX(-50%);
      font-size: 12px;
      &.jump {
        animation: jump_tip 1s linear infinite;
        font-size: 18px;
      }
      &.no_more {
        color: gray;
        margin-top: -5px;
        padding: 3px;
        border-bottom: 1px solid gray;
        user-select: none;
        &:hover {
          color: #003cff;
          border-bottom: 1px solid #003cff;
        }
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
    position: relative;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.7);
    overflow: hidden;
    .record_info_mask {
      position: absolute;
      top: 50%;
      width: 100%;
      text-align: center;
      transform: translateY(-50%);
      -webkit-box-reflect: below 2px
        linear-gradient(transparent, rgba(0, 0, 0, 0.6));
    }
  }
}
.applic_bottom {
  width: 100%;
  height: 300px;
  margin: 30px auto;
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

.left_regis_data_show {
  width: 100%;
  height: 85%;
  display: flex;
  flex-direction: column;
  overflow: scroll;
  border-bottom: 1px solid black;
  .regis_list {
    display: flex;
    padding: 5px;
    i {
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: space-around;
      width: 25%;
      background-color: #c4c4c4;
      color: white;
      margin-right: 5px;
      padding: 5px;
      border-radius: 5px;
      font-size: 1rem;
      user-select: none;
    }
    &.messageInfo {
      display: block;
      i {
        background-color: #ffffff;
        color: black;
      }
    }
  }
}
.el-textarea__inner {
  user-select: none;
}
</style>