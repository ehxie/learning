// 配置文件类型提示，编写配置时打开可以有提示
// import { Configuration } from 'webpack'
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

/**
 * @type {Configuration}
 */
const config = {
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        filename: "[name].[hash:6].js",
        path: path.join(__dirname, 'dist/')
    },
    // 不会启动代码优化，可以查看产物
    mode: 'none',
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'plugin',
            meta: {
                viewport: 'width=device-width'
            }
        })
    ]
}

module.exports = config