import Vue from 'vue';

import App from './App.vue';

// 全局组件
import './components';

// 插件
import './plugins/element.js';
import './plugins/echarts';

// 样式
import './styles/index.scss';

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  render: (h) => h(App)
});
