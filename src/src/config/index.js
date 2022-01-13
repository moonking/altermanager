/**
 * @description 配置文件入口
 * @author ljq
 * @date 2019/6/28
 */
/* eslint-disable */
let config;
// console.log('\n\n\nNODE_ENV=%s\n\n\n', process.env.NODE_ENV);
switch (process.env.NODE_ENV) {

  case "production":
    config = require("./prod");
    break;
  default:
    config = require("./dev");
}

module.exports = config;
