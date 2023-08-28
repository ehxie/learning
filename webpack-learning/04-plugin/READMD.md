# plugin

webpack 的 plugin 机制是为了增强 webpack 在项目自动化构建方面的能力

## 常用场景

1. 实现在自动打包前清除 dist 目录（即上次的打包结果）
2. 自动生成应用所需要的 HTML 文件
3. 根据不同环境为代码注入类似 API 地址这种会变化的部分
4. 拷贝不需要参与打包的文件到输出目录
5. 压缩打包后的输出文件
6. 自动发布打包结果到服务器实现自动部署

## 体验插件

### 自动清除 dist 目录

webpack 打包结果都是直接覆盖到 dist 目录

- 打包前 dist 目录中存在上次打包遗留的文件，再次打包只会覆盖掉同名的文件，已移出的资源文件一直遗留在里面，导致部署上线时有多余的文件

例子：当打包的结果带上 hash 时，每次打包后的产物名字不同则不会覆盖，每打包一次会增加一个文件

- 修改配置文件

```js
const path = require('path')
const config = {
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        // [hash:6]: 生成 6 位数的 hash
        filename: "[name].[hash:6].js",
        path: path.join(__dirname, 'dist/')
    }
}

module.exports = config
```

现在可以执行几次打包，看看 dist 目录生成的结果

- 每次执行前修改一下代码，因为如果文件没有修改则会命中缓存，直接复用原来的结果

```shell
npm run build:plugin
```

实现打包前清除 dist

1.安装第三方插件

```shell
# 自行搜索支持的 webpack 版本
npm install --save-dev clean-webpack-plugin@4
```

2.增加 plugins 配置

```js
const config = {
    // ...
    plugins: [
        new CleanWebpackPlugin()
    ]
}

module.exports = config
```

无论执行几次打包，dist 目录中都只有一个产物

### 用于自动生成 HTML 的插件

HTML 文件一般都是通过硬编码的形式存放于项目的根目录下，这样会存在一些问题

- 项目发布时，需要发布 HTML 文件和 dist 的产物，而且需要确保 HTML 中资源文件的路径正确（例如上面的打包生成的 JS 文件都是带 hash 的，那么每次打包后都需要重新修改 HTML 文件才能正常运行）

自动生成 HTML 的优势

- HTML 文件也输出到 dist 目录了，上线只需要把 dist 目录发布出去
- HTML 中的 script 标签是自动引入的，可以保证资源路径的正确

1.安装第三方插件

```shell
npm i --save-dev html-webpack-plugin@4
```

2.增加 plugins 配置

```js
const config = {
    // ...
    plugins: [
        new HtmlWebpackPlugin()
    ]
}

module.exports = config
```

此时执行打包命令就会自动生成一个 `index.html` 文件

但是我们希望生成的 HTML 文件标题要修改为 `plugin`，且要自定义页面中的一些 meta 属性和 DOM 结构

方式一：[修改配置](/webpack-learning/04-plugin/webpack.config.base.js)

```js
const config = {
    // ...
    plugins: [
        new HtmlWebpackPlugin({
            title: 'plugin',
            meta: {
                viewport: 'width=device-width'
            }
        })
    ]
}

module.exports = config
```

方式二：新增 HTML 模板

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>
        <%= htmlWebpackPlugin.options.title %>
    </title>
</head>

<body>
    <h1>html template</h1>
    <div id="app"></div>
</body>

</html>
```

修改配置文件

```js
const config = {
    // ...
    plugins: [
        new HtmlWebpackPlugin({
            title: 'plugin-title',
            template: path.join(__dirname, 'src/index.html')
        })
    ]
}

module.exports = config
```

如果是**多页面应用**，则将 HtmlWebpackPlugin 插件复制多份即可实现

- 多入口可以判断不同的 entry 执行不同的 HTML 模板打包

```js
const config = {
    // ...
    plugins: [
        // 生成 index.html
        new HtmlWebpackPlugin({
            title: 'plugin',
            template: path.join(__dirname, 'src/index.html')
        }),
        // 生成 about.html
        new HtmlWebpackPlugin({
            filename: 'about.html'
        })
    ]
}

module.exports = config
```

### 用于复制文件的插件

项目中一般还有一些不需要参与构建的静态文件，最终也需要发布到线上

- 例如网站的 favicon、robots.txt，一般建议把这些文件统一放在项目根目录下的 public 或者 static 中

```shell
# 安装支持 webpack4 的版本
npm install copy-webpack-plugin@5 --save-dev
```

修改配置

```js
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = {
    // ...
    plugins: [
        new CopyWebpackPlugin([
            // 传入需要拷贝的目录
            new CopyWebpackPlugin([path.join(__dirname, 'public')])
        ])
    ]
}

module.exports = config
```
