import Vue from 'vue';
import VeLine from 'v-charts/lib/line.common';
import VeHistogram from 'v-charts/lib/histogram.common';
// import VePie from 'v-charts/lib/pie.common';
import VeBar from 'v-charts/lib/bar.common';
import 'echarts/lib/component/legendScroll';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';

Vue.component(VeLine.name, VeLine);
Vue.component(VeHistogram.name, VeHistogram);
// Vue.component(VePie.name, VePie);
Vue.component(VeBar.name, VeBar);
