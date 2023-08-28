// 配置文件类型提示，编写配置时打开可以有提示
// import { Configuration } from 'webpack'
const path = require('path')
const RemoveCommentsPlugin = require('./plugins/remove-comments-plugin')

/**
 * @type {Configuration}
 */
const config = {
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        filename: "[name].js",
        path: path.join(__dirname, 'dist/')
    },
    // 不会启动代码优化，可以查看产物
    mode: 'none',
    plugins: [
        new RemoveCommentsPlugin()
    ]
}

module.exports = config