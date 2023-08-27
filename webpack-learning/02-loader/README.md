# Loader

webpack **只能**加载 JS 模块，Loader 可以让 webpack 加载特殊的模块（例如 `.js`、`.css`、`.less`、`.png` 等等资源文件）

## 1、直接打包 css 文件

把配置文件的入口改为 css 文件

```js
const path = require('path')

const config = {
    entry: path.join(__dirname, 'src/index.css'),
    // ...
}

module.exports = config
```

此时直接运行打包命令则会报错

```shell
npm run build:loader
```

提示模块解析错误（语法不正确），并且告诉你需要应该正确的 loader 来处理这种类型的文件

```text
ERROR in ./02-loader/src/index.css 1:4
Module parse failed: Unexpected token (1:4)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> body{
|     margin: 0 auto;
|     background-color: red;
```

如果此时将 `index.css` 中的代码修改为 js 的代码即可正常运行

- 执行打包后，打开 `index.html` 查看控制台即可看到输出

```css
console.log('改为 js 代码后无需 loader 也可以正常执行')
```

## 使用 css loader 解析 css 文件

> 不同的 loader 支持的 webpack 版本不同
>
> - 通过不同 Tag 的[package.json](https://github.com/webpack-contrib/css-loader/blob/master/package.json)文件中的 peerDependencies 字段可以看到支持的 webpack 版本

```shell
# 安装 loader
npm install css-loader@4 --save-dev
```

添加配置

```js
const config = {
    // ...
    module: {
        rules: [
            {
                // 匹配的文件
                test: /\.css$/,
                // 使用的 loader
                use: 'css-loader'
            }
        ]
    }
}

module.exports = config

```

此时再执行打包就没正常了

> css -> css loader -> webpack -> main.bundle.js

但是打开 `index.html` 后会发现并没有生效

原因: 可以查看打包后的产物

- 只把 CSS 模块转换为 JS 模块，并没有使用

```js
(function(modules) {})([
    (function(module, __webpack_exports__, __webpack_require__) {
    // ... 省略，只展示关键代码

    // loader 的作用是将 css 模块转换为 js 模块
    // - 将 css 代码当做字符串，然后 push 到一个数组中
    var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(false);
    ___CSS_LOADER_EXPORT___.push([module.i, "body{\n    margin: 0 auto;\n    background-color: red;\n}", ""]);
    // 只是将转换后的 loader 暴露出去，并没有使用
    __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);
}),
    (function(module, __webpack_exports__, __webpack_require__) {})
])
```

解决方法很简单，只需要添加一个 `style-loader` 即可

- 作用：创建 `style` 标签，将 css-loader 生成的数组的元素拼进去

```shell
# 同样需要查找兼容的版本
npm install style-loader@2 --save-dev
```

修改配置

- 多个 loader 时需要注意顺序，在数组后面的 loader 会先执行

```js
const config = {
    // ...
    module: {
        rules: [
            {
                test: /\.css$/,
                // 注意顺序，此时执行先后为先执行 css-loader 再执行 style-loader
                use: [
                    'style-loader',
                    'css-loader',
                ]
            }
        ]
    }
}

module.exports = config
```

此时执行打包后打开 `index.html` 页面，可以看到背景颜色已经变成了红色了

## 为什么要在 JS 中加载其他资源

假设在页面开发中某个局部功能需要用到一个样式模块和图片

- 如果在资源单独放在 HTML 中加载而逻辑放在 JS 文件中，那么后续维护时需要维护 HTML 文件和 JS 文件
- 如果都放在一个 JS 文件中，那么后续只需要维护这个模块就可以了
