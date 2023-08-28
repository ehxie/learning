// 配置文件类型提示，编写配置时打开可以有提示
// import { Configuration } from 'webpack'
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

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
        // 生成 index.html
        new HtmlWebpackPlugin({
            title: 'plugin-title',
            template: path.join(__dirname, 'src/index.html')
        }),
        // 生成 about.html
        new HtmlWebpackPlugin({
            filename: 'about.html',
            template: path.join(__dirname, 'src/about.html')
        }),
        // 传入需要拷贝的目录
        new CopyWebpackPlugin([path.join(__dirname, 'public')])
    ]
}

module.exports = config