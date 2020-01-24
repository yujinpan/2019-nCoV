/**
 * {test: 1} => [{key: 'test', value: 1}]
 */
export function objectToArray(object, { key = 'key', value = 'value' }) {
  return Object.entries(object).map((item) => ({
    [key]: item[0],
    [value]: item[1]
  }));
}

/**
 * 对象属性过滤
 * @param {Object} object
 * @param {Array<String>} filterKeys
 */
export function objectFilter(object, filterKeys) {
  const result = {};
  for (let key in object) {
    if (object.hasOwnProperty(key) && filterKeys.includes(key)) {
      result[key] = object[key];
    }
  }
  return result;
}
