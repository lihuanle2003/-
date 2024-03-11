<template>
  <div class="main">
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in list" :key="index">
        <div class="grid-content bg-purple">
          <h4>{{ item.message }}</h4>
          <vueCount :startVal="0" :endVal="item.val" :duration="duration" />
        </div>
      </el-col>
    </el-row>
    <!-- 图标区域 -->
    <div class="echarts">
      <div class="echarts1"></div>
      <div class="echarts2"></div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import vueCount from "vue-count-to";
export default {
  name: "",
  props: [""],
  data() {
    return {
      list: [
        { val: 2400, message: "最高可借金额" },
        { val: 300, message: "回报率" },
        { val: 9833, message: "业绩领跑" },
        { val: 8400, message: "安稳底薪战队" },
      ],
      duration: 3000,
    };
  },

  components: {
    vueCount,
  },

  computed: {},

  created() {},

  mounted() {
    this.initCharts();
  },

  methods: {
    initCharts() {
      const colors = ["#5470C6", "#EE6666"];
      this.echarts1 = echarts.init(document.querySelector(".echarts1"));
      this.echarts1.setOption({
        color: colors,
        tooltip: {
          trigger: "none",
          axisPointer: {
            type: "cross",
          },
        },
        legend: {},
        grid: {
          top: 70,
          bottom: 50,
        },
        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors[1],
              },
            },
            axisPointer: {
              label: {
                formatter: function (params) {
                  return (
                    "Precipitation  " +
                    params.value +
                    (params.seriesData.length
                      ? "：" + params.seriesData[0].data
                      : "")
                  );
                },
              },
            },
            // prettier-ignore
            data: ['2016-1', '2016-2', '2016-3', '2016-4', '2016-5', '2016-6', '2016-7', '2016-8', '2016-9', '2016-10', '2016-11', '2016-12'],
          },
          {
            type: "category",
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors[0],
              },
            },
            axisPointer: {
              label: {
                formatter: function (params) {
                  return (
                    "Precipitation  " +
                    params.value +
                    (params.seriesData.length
                      ? "：" + params.seriesData[0].data
                      : "")
                  );
                },
              },
            },
            // prettier-ignore
            data: ['2015-1', '2015-2', '2015-3', '2015-4', '2015-5', '2015-6', '2015-7', '2015-8', '2015-9', '2015-10', '2015-11', '2015-12'],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Precipitation(2015)",
            type: "line",
            xAxisIndex: 1,
            smooth: true,
            emphasis: {
              focus: "series",
            },
            data: [
              2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0,
              2.3,
            ],
          },
          {
            name: "Precipitation(2016)",
            type: "line",
            smooth: true,
            emphasis: {
              focus: "series",
            },
            data: [
              3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3,
              0.7,
            ],
          },
        ],
      });

      const labelRight = {
        position: "right",
      };
      this.echarts2 = echarts.init(document.querySelector(".echarts2"));
      this.echarts2.setOption({
        title: {
          text: "Bar Chart with Negative Value",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          top: 80,
          bottom: 30,
        },
        xAxis: {
          type: "value",
          position: "top",
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
        },
        yAxis: {
          type: "category",
          axisLine: { show: false },
          axisLabel: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          data: [
            "ten",
            "nine",
            "eight",
            "seven",
            "six",
            "five",
            "four",
            "three",
            "two",
            "one",
          ],
        },
        series: [
          {
            name: "Cost",
            type: "bar",
            stack: "Total",
            label: {
              show: true,
              formatter: "{b}",
            },
            data: [
              { value: -0.07, label: labelRight },
              { value: -0.09, label: labelRight },
              0.2,
              0.44,
              { value: -0.23, label: labelRight },
              0.08,
              { value: -0.17, label: labelRight },
              0.47,
              { value: -0.36, label: labelRight },
              0.18,
            ],
          },
        ],
      });
    },
  },
};
</script>
<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
  height: 100px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
  height: 100%;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  display: flex;
  border-radius: 4px;
  min-height: 36px;
  height: 100%;
  padding: 10px;
  flex-flow: column;
  align-items: center;
  justify-content: center;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.echarts {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .echarts1,.echarts2 {
    width: 45%;
    height: 500px;
  }
}
</style>