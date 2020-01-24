<template>
  <div id="app" class="full-height padding-large">
    <ve-line height="100%" :extend="chartExtend" :data="chartData"></ve-line>
  </div>
</template>

<script>
import { getStat2019 } from '@/api/app';

export default {
  name: 'app',
  data() {
    return {
      chartExtend: {
        color: [
          '#c23531',
          '#2f4554',
          '#61a0a8',
          '#d48265',
          '#91c7ae',
          '#749f83',
          '#ca8622',
          '#bda29a',
          '#6e7074',
          '#c4ccd3'
        ],
        series: {
          label: {
            normal: {
              show: true
            }
          }
        },
        title: {
          text: '2019-nCoV 确诊病例统计',
          subtext: '（数据来源：维基百科 2019－2020年新型冠狀病毒肺炎事件）',
          sublink:
            'https://zh.wikipedia.org/wiki/2019－2020年新型冠狀病毒肺炎事件',
          left: 'center'
        },
        grid: {
          top: 100,
          right: 150,
          bottom: 0
        },
        tooltip: {
          confine: true
        },
        legend: {
          top: 40,
          type: 'scroll',
          orient: 'vertical',
          right: 0
          // 勾选的类型
          // selected: {}
        },
        xAxis: {
          axisLabel: {
            rotate: 45
          }
        }
      },
      chartData: {
        columns: [],
        rows: []
      }
    };
  },
  mounted() {
    getStat2019().then(({ data, columns }) => {
      this.chartData.columns = columns;
      this.chartData.rows = data;
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~@/styles/common-variables.scss';

#app {
}
</style>
