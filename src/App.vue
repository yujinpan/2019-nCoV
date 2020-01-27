<template>
  <div id="app" class="full-height padding-large">
    <h3 class="text-center">2019-nCoV 全球数据统计（不代表最新实时信息）</h3>
    <el-divider></el-divider>
    <ve-histogram
      v-loading="loading4"
      style="margin-bottom: -20px;"
      :extend="chartExtend4"
      :settings="chartSettings4"
      :data="chartData4"
    ></ve-histogram>
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
import { getStat2019, getStat2019New, getStatLevel } from '@/api/app';

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
        text: '确诊病例变化趋势（数据源更改，不再更新）',
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
      loading4: false,
      chartExtend,
      chartData: {
        columns: [],
        rows: []
      },
      chartExtend2: {
        ...common,
        title: {
          text: '确诊病例地区数量（数据源更改，不再更新）',
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
          text: '确诊病例严重程度（数据源更改，不再更新）',
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
      },
      chartSettings4: {
        labelMap: {
          confirmed: '确诊',
          dead: '死亡',
          healed: '治愈',
          severe: '重症',
          suspected: '疑似病例',
          watch: '观察中',
          deadPercent: '死亡率',
          healedPercent: '治愈率',
          severePercent: '重症率'
        },
        showLine: ['deadPercent', 'healedPercent', 'severePercent'],
        axisSite: {
          right: ['deadPercent', 'healedPercent', 'severePercent']
        },
        yAxisType: ['normal', 'percent'],
        yAxisName: ['数量', '比率']
      },
      chartExtend4: {
        ...chartExtend,
        title: {
          text: '最新病例综合统计',
          textStyle: {
            fontSize: 16,
            color: '#666'
          },
          subtext: '（数据来源：国家卫建委 - 新型冠状病毒感染的肺炎疫情防控）',
          sublink: 'http://www.nhc.gov.cn/xcs/yqtb/list_gzbd.shtml',
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
            重症: false,
            重症率: false,
            疑似病例: false,
            观察中: false
          }
        }
      },
      chartData4: {
        columns: [
          'date',
          'confirmed',
          'dead',
          'healed',
          'deadPercent',
          'healedPercent',
          'severe',
          'suspected',
          'watch',
          'severePercent'
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

    this.loading4 = true;
    getStat2019New().then((data) => {
      this.chartData4.rows = data.map((item) =>
        Object.assign(item, item.data, {
          deadPercent: item.data.dead / item.data.confirmed,
          healedPercent: item.data.healed / item.data.confirmed,
          severePercent: item.data.severe / item.data.confirmed
        })
      );
      this.loading4 = false;
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
