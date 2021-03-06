import request from '../utils/request';
import { utils } from 'xlsx';
import { GLOBAL_CONFIG, REST_SERVICE } from '@/config';
import { localDataApp } from '@/utils/local-data';

/**
 *  获取 2019 年统计数据（新）
 * @return {Promise}
 */
export function getStat2019New() {
  if (!localDataApp.get()) {
    localDataApp.set({
      list: '',
      details: {}
    });
  }
  const localData = localDataApp.get();
  return request({
    url: REST_SERVICE.proxy,
    method: 'get',
    params: {
      url: REST_SERVICE.gov.list
    }
  })
    .then(null, () => Promise.resolve(localData ? localData.list : ''))
    .then(
      /**@param {String} res */ (res) => {
        res = typeof res === 'string' ? res : String(res);
        const regList = /<li>.*<\/li>/g;
        let list = res.match(regList);
        if (!list) {
          list = localData.list ? localData.list.match(regList) : [];
        } else {
          localDataApp.update({
            list: res
          });
        }
        list = list
          .map((item) => ({
            date: item.match(/\d{4}-\d{2}-\d{2}/)[0],
            url:
              REST_SERVICE.gov.origin +
              item.replace(/.*href="([^"]*)".*/, '$1'),
            data: {
              confirmed: 0, // 确诊
              severe: 0, // 重症
              dead: 0, // 死亡
              healed: 0, // 治愈
              suspected: 0, // 疑似
              watch: 0 // 观察
            }
          }))
          .reverse();
        return Promise.all(
          list.map((item) =>
            request({
              url: REST_SERVICE.proxy,
              method: 'get',
              params: {
                url: item.url
              }
            }).then(
              (res) => {
                res = typeof res === 'string' ? res : String(res);
                if (!res.match(/<p>/)) {
                  if (localData.details[item.date]) {
                    return localData.details[item.date];
                  } else {
                    return '';
                  }
                } else {
                  localDataApp.update({
                    details: Object.assign(localData.details, {
                      [item.date]: res
                    })
                  });
                  return res;
                }
              },
              () => {
                if (localData.details[item.date]) {
                  return Promise.resolve(localData.details[item.date]);
                } else {
                  return Promise.resolve('');
                }
              }
            )
          )
        ).then(
          /**@param {Array<String>} resArr */ (resArr) => {
            const keys = [
              'confirmed',
              'severe',
              'dead',
              'healed',
              'suspected',
              'watch'
            ];
            let nextItem, prevItem;
            resArr.forEach((res, index) => {
              nextItem = list[index].data;
              prevItem = index > 0 ? list[index - 1].data : null;
              Object.assign(nextItem, {
                confirmed: getCount(
                  res,
                  /.*累计.*(确诊|肺炎)病例(\d+)例.*/,
                  '$2'
                ),
                severe: getCount(res, /.*累计.*重症(病例)?(\d+)例.*/, '$2'),
                dead: getCount(res, /.*累计.*死亡(病例)?(\d+)例.*/, '$2'),
                healed: getCount(res, /.*累计.*出院(病例)?(\d+)例.*/, '$2'),
                suspected: getCount(res, /.*累计.*疑似(病例)?(\d+)例.*/, '$2'),
                watch: getCount(
                  res,
                  /.*追踪.*(尚有|尚在接受医学观察)(\d+)人.*/,
                  '$2'
                )
              });
              keys.forEach((key) => {
                if (!nextItem[key] && nextItem[key] !== 0) {
                  nextItem[key] = prevItem ? prevItem[key] || 0 : 0;
                }
              });
            });
            return list;
          }
        );
      }
    );
}

/**
 * 获取例数
 * @param {String} text
 * @param {RegExp} reg
 * @param {String} [regReplace]
 * @return {Number|null}
 */
export function getCount(text, reg, regReplace = '$1') {
  const match = text.match(reg);
  return match ? +match[0].replace(/\s/g, '').replace(reg, regReplace) : null;
}

// 获取 2019 年统计数据（旧）
export function getStat2019() {
  return request({
    url: REST_SERVICE.wikipedia.detail
  }).then((res) => {
    const container = document.createElement('div');
    container.innerHTML = /**@type {String} */ res;
    const data = getTableData(container);

    // 按照时间进行归类
    const result = [];
    let find, newItem;
    data.forEach((area) => {
      area.data.forEach((item) => {
        find = result.find((item2) => item.date === item2.date);
        newItem = {
          date: item.date,
          [area.area]: item.count
        };
        if (find) {
          Object.assign(find, newItem);
        } else {
          result.push(newItem);
        }
      });
    });

    // 时间排序
    result.sort((a, b) => new Date(a.date) - new Date(b.date));

    // 获取 columns
    const keys = new Set();
    result.forEach((item) => Object.keys(item).forEach((key) => keys.add(key)));
    const columns = Array.from(keys);

    // 根据 columns 补全数据
    const areaKeys = columns.slice(1);
    result.forEach((item, index, arr) => {
      areaKeys.forEach((key) => {
        if (index > 0 && (!item[key] || item[key] < arr[index - 1][key])) {
          item[key] = arr[index - 1][key];
        }
      });
    });

    // 计算总数
    result.forEach((item) => {
      item['总数'] = columns
        .slice(1)
        .reduce((prev, next) => prev + (item[next] || 0), 0);
    });
    columns.splice(1, 0, '总数');
    // 校验最新的总数
    const lastItem = result.slice(-1)[0];
    lastItem['总数'] = Math.max(lastItem['总数'], GLOBAL_CONFIG.total);

    // 对 columns 进行排序
    const total = result.slice(-1)[0];
    columns.sort((a, b) => total[b] - total[a]);

    return {
      columns,
      data: result
    };
  });
}

/**
 * 获取感染程度统计
 * @param {Array<{date, total}>} totalStat
 * @return {Promise}
 */
export function getStatLevel(totalStat) {
  return request({
    url: REST_SERVICE.wikipedia.detail2
  }).then((res) => {
    const keys = [
      'die',
      'diePercent',
      'cure',
      'curePercent',
      'warn',
      'warnPercent',
      'danger',
      'dangerPercent'
    ];
    let levelData, prevItem;
    const result = [];
    totalStat.forEach((item, index) => {
      levelData = res[item.date] || {};
      Object.assign(levelData, {
        diePercent: getPercent(item.total, levelData.die),
        curePercent: getPercent(item.total, levelData.cure),
        warnPercent: getPercent(item.total, levelData.warn),
        dangerPercent: getPercent(item.total, levelData.danger)
      });
      prevItem = result[index - 1];
      keys.forEach((key) => {
        if (!levelData[key] && levelData[key] !== 0) {
          levelData[key] = prevItem ? prevItem[key] : 0;
        }
      });
      result.push({
        date: item.date,
        total: item.total,
        ...levelData
      });
    });
    return result;
  });
}

// 获取 2003 年统计

// 获取 table 的 json 数据
function getTableData(tableElem) {
  const sheet = utils.table_to_sheet(tableElem, {
    raw: true
  });
  const json = utils.sheet_to_json(sheet);

  // 合并日期，补全报告信息与地区
  const dateArr = [];
  json.forEach((item, index, arr) => {
    // 如果没有报告则继承前一个
    if (!item['病例报告']) {
      item['病例报告'] = arr[index - 1]['病例报告'];
    }
    if (!item['病患地区']) {
      item['病患地区'] = arr[index - 1]['病患地区'];
    }
    // 合并两条报告
    if (!item['报告日期']) {
      arr[index - 1]['病例报告'] += item['病例报告'];
    } else {
      dateArr.push(item);
    }
  });

  // 合并地区
  const result = [];
  let prev, newItem, count, area;
  dateArr.forEach((item) => {
    count = findCount(item['病例报告']);
    if (count > 0) {
      newItem = {
        date: item['报告日期'],
        count
      };
      area = item['病患地区'].trim().replace(/(自治区|半岛地区)$/, '');
      if (!result.length || area !== result.slice(-1)[0].area) {
        prev = {
          area,
          data: [newItem]
        };
        result.push(prev);
      } else {
        prev.data.push(newItem);
      }
    }
  });

  return result;
}

// 找出累计数量
function findCount(text) {
  let count;

  // 匹配累计关键字
  let match = text.match(/累计(确诊)?(\d+)例/g);
  if (match) {
    count = Math.max(
      ...match.map((item) =>
        Number(item.replace(/.*累计(确诊)?(\d+)例.*/, '$1'))
      )
    );
    if (count > 0) return count;
  }

  // 匹配数字关键字
  match = text.match(/\d+[例宗]/g);
  if (match) {
    count = Math.max(...match.map((item) => Number(item.slice(0, -1))));
    if (count > 0) return count;
  }

  // 匹配特殊关键字
  if (text.includes('三宗武汉肺炎确诊病例')) {
    return 3;
  }
  if (
    text.includes('74岁中华人民共和国籍女子，其于1月13日抵达泰国') ||
    text.includes('确诊第二例') ||
    text.includes('两父子被确诊') ||
    text.includes('第二例确诊病例') ||
    text.includes('第二宗确诊病例')
  ) {
    return 2;
  }
  if (
    text.includes('1例输入性病例') ||
    text.includes('第一例确诊病例') ||
    text.includes('确诊首例') ||
    text.includes('首例确诊') ||
    text.includes('首宗确诊') ||
    text.includes('神奈川县，30+岁中华人民共和国籍男性') ||
    text.includes('确认为新型冠状病毒')
  ) {
    count = Number(text.replace(/.*新增(\d+)例.*/, '$1'));
    return count > 0 ? count + 1 : 1;
  }
}

// 计算比例
function getPercent(total, value) {
  return !Number.isNaN(value) ? +(value / total).toFixed(5) : undefined;
}

// 查找 wiki 页面的 table
// https://zh.wikipedia.org/wiki/2019－2020年新型冠狀病毒肺炎事件#各地疫情及反應
(function getTableHTML() {
  const captionElem = Array.from(document.querySelectorAll('caption')).find(
    (elem) => elem.innerText === '2019～2020新型冠状病毒(2019-nCoV)各地疫情报告'
  );
  if (captionElem) {
    // eslint-disable-next-line no-console
    console.log(captionElem.parentNode.outerHTML);
  }
})();
