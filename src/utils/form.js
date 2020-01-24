/**
 * 从表单数据中获取 prop 结构
 * @param formData example: [{prop: 'test', label: 'test'}]
 * @return {*}
 */
export function getProps(formData) {
  return formData.reduce((prev, next) => {
    prev[next.prop] = next.value;
    return prev;
  }, {});
}

/**
 * 获取表单验证规则
 * @param {String} name 错误信息的名称，例如：姓名
 * @param {Array<String>} types 类型，包括：required/number
 * @return {Array<*>}
 */
export function getRules(name, types) {
  const rules = [];
  let item;
  types.forEach((type) => {
    switch (type) {
      case 'required':
        item = {
          required: true,
          message: `${name}为必填项`
        };
        break;
      case 'number':
        item = {
          validator: (rule, val, callback) => {
            return callback(
              val && !/^\d+(\.\d+$|$)/.test(val)
                ? `${name}为数字类型`
                : undefined
            );
          }
        };
        break;
    }
    item && rules.push(item);
  });
  return rules;
}
