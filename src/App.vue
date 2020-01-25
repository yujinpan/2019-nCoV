<template>
  <div id="app" class="full-height padding-large">
    <h3 class="text-center">2019-nCoV 全球数据统计（不代表最新实时信息）</h3>
    <p class="text-center text-secondary">更新时间：2020-01-26 01:42</p>
    <el-divider></el-divider>
    <ve-line
      style="margin-bottom: -20px;"
      :extend="chartExtend"
      :data="chartData"
    ></ve-line>
    <el-divider></el-divider>
    <ve-bar height="900px" :extend="chartExtend2" :data="chartData2"></ve-bar>
  </div>
</template>

<script>
import { getStat2019 } from '@/api/app';

export default {
  name: 'app',
  data() {
    const common = {
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
      ]
    };
    return {
      chartExtend: {
        ...common,
        grid: {
          top: 120,
          left: 20,
          right: 20,
          bottom: 20
        },
        legend: {
          top: 60,
          type: 'scroll',
          selector: true
        },
        title: {
          text: '确诊病例变化趋势',
          textStyle: {
            fontSize: 16,
            color: '#666'
          },
          subtext: '（数据来源：维基百科 2019－2020年新型冠狀病毒肺炎事件）',
          sublink:
            'https://zh.wikipedia.org/wiki/2019－2020年新型冠狀病毒肺炎事件',
          left: 'center'
        },
        xAxis: {
          axisLabel: {
            rotate: 45
          }
        },
        tooltip: {
          confine: true
        }
      },
      chartData: {
        columns: [],
        rows: []
      },
      chartExtend2: {
        ...common,
        title: {
          text: '确诊病例地区数量',
          textStyle: {
            fontSize: 16,
            color: '#666'
          },
          subtext: '（数据来源：维基百科 2019－2020年新型冠狀病毒肺炎事件）',
          sublink:
            'https://zh.wikipedia.org/wiki/2019－2020年新型冠狀病毒肺炎事件',
          left: 'center'
        },
        grid: {
          top: 70,
          left: 20,
          right: 20,
          bottom: 20
        },
        legend: {
          show: false
        },
        series: {
          label: {
            normal: {
              show: true,
              position: 'right'
            }
          }
        }
      },
      chartData2: {
        columns: [],
        rows: []
      }
    };
  },
  mounted() {
    getStat2019().then(({ data, columns }) => {
      this.chartData.columns = columns;
      this.chartData.rows = data;

      const lastItem = data[data.length - 1];
      this.chartData2.columns = ['地区', '病例数'];
      this.chartData2.rows = columns
        .slice(2)
        .map((item) => ({
          ['地区']: item,
          ['病例数']: lastItem[item]
        }))
        .reverse();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '~@/styles/common-variables.scss';

#app {
  line-height: 1.5;
}
</style>
