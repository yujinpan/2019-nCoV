import request from '../utils/request';
import { utils } from 'xlsx';
import { REST_SERVICE } from '@/config';

// 获取 2019 年统计
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

    // 对 columns 进行排序
    const total = result.slice(-1)[0];
    columns.sort((a, b) => total[b] - total[a]);

    return {
      columns,
      data: result
    };
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
      area = item['病患地区'].trim().replace(/(自治区)$/, '');
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
