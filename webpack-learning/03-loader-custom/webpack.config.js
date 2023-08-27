// 配置文件类型提示，编写配置时打开可以有提示
// import { Configuration } from 'webpack'
const path = require('path')

/**
 * @type {Configuration}
 */
const config = {
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        filename: "[name].bundle.js",
        path: path.join(__dirname, 'dist/')
    },
    // 不会启动代码优化，可以查看产物
    mode: 'none',
    module: {
        rules: [
            {
                test: /\.md$/,
                use: path.join(__dirname, 'loader/markdown-loader.js')
            }
        ]
    }
}

module.exports = config