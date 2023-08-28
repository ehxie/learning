// 配置文件类型提示，编写配置时打开可以有提示
const path = require('path')

/** @typedef {import("webpack").Configuration} Configuration */

/**
 * @type {Configuration}
 */
const config = {
    entry: path.join(process.cwd(), '01-start/src/index.js'),
    output: {
        filename: "[name].bundle.js",
        path: path.join(process.cwd(), '01-start/dist/')
    },
    // 不会启动代码优化，可以查看产物
    mode: 'none'
}

module.exports = config