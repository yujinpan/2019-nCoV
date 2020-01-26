<template>
  <div id="app" class="full-height padding-large">
    <h3 class="text-center">2019-nCoV 全球数据统计（不代表最新实时信息）</h3>
    <p class="text-center text-secondary">更新时间：2020-01-26 11:53</p>
    <el-divider></el-divider>
    <ve-line
      style="margin-bottom: -20px;"
      :extend="chartExtend"
      :data="chartData"
    ></ve-line>
    <el-divider></el-divider>
    <ve-bar height="900px" :extend="chartExtend2" :data="chartData2"></ve-bar>
    <el-divider></el-divider>
    <ve-histogram
      style="margin-bottom: -20px;"
      :extend="chartExtend3"
      :settings="chartSettings3"
      :data="chartData3"
    ></ve-histogram>
  </div>
</template>

<script>
import { getStat2019, getStatLevel } from '@/api/app';

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
      ],
      tooltip: {
        confine: true
      }
    };
    const chartExtend = {
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
      }
    };
    return {
      chartExtend,
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
      },
      chartSettings3: {
        labelMap: {
          total: '总数',
          die: '死亡',
          diePercent: '死亡率',
          cure: '治愈',
          curePercent: '治愈率',
          warn: '重症',
          warnPercent: '重症率',
          danger: '危重症',
          dangerPercent: '危重症率'
        },
        showLine: ['diePercent', 'curePercent', 'warnPercent', 'dangerPercent'],
        axisSite: {
          right: ['diePercent', 'curePercent', 'warnPercent', 'dangerPercent']
        },
        yAxisType: ['normal', 'percent'],
        yAxisName: ['数量', '比率']
      },
      chartExtend3: {
        ...chartExtend,
        title: {
          text: '确诊病例严重程度',
          textStyle: {
            fontSize: 16,
            color: '#666'
          },
          subtext: '（数据来源：维基百科 2019－2020年新型冠狀病毒肺炎事件）',
          sublink:
            'https://zh.wikipedia.org/wiki/2019－2020年新型冠狀病毒肺炎事件',
          left: 'center'
        },
        series: {
          barMinHeight: 2,
          barMaxWidth: 40
        },
        legend: {
          top: 60,
          type: 'scroll',
          selector: true,
          selected: {
            总数: true,
            死亡: true,
            治愈: true,
            重症: false,
            危重症: false,
            死亡率: true,
            治愈率: true,
            重症率: false,
            危重症率: false
          }
        }
      },
      chartData3: {
        columns: [
          'date',
          'total',
          'die',
          'cure',
          'warn',
          'danger',
          'diePercent',
          'curePercent',
          'warnPercent',
          'dangerPercent'
        ],
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

      getStatLevel(
        data.map((item) => ({ date: item.date, total: item['总数'] }))
      ).then((result) => {
        this.chartData3.rows = result;
      });
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
