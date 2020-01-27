export const GLOBAL_CONFIG = window.CONFIG; // 来自 public/config.js 中

export const REST_SERVICE = {
  proxy:
    process.env.NODE_ENV !== 'production'
      ? 'http://localhost:5050'
      : 'https://yujinpan.applinzi.com',
  gov: {
    origin: 'http://www.nhc.gov.cn/',
    list: 'http://www.nhc.gov.cn/xcs/yqtb/list_gzbd.shtml'
  },
  wikipedia: {
    detail: '/table.txt',
    detail2: '/table2.json'
  }
};
