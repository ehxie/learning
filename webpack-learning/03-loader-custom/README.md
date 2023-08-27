# Loader Custom

自定义 Loader

需求: 开发一个 Loader 可以解析 MD 文件

- markdown -> markdown-loader -> HTML

`about.md`

```text
# About

**hello** loader

```

`index.js`

```js
import about from './about.md'

document.body.innerHTML = about


```

修改配置文件

```js
const config = {
    // ...
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
```

Loader 书写的要求

- 最开始接收的参数是源文件的内容
- 最后一个 loader 返回的结果必须是 js 代码，webpack 会将这个 js 字符串代码拼接到 module 中

> any source -> loader1 -> loader2 -> loader3 -> loaderN -> JavaScriptCode

如果修改 `markdown-loader.js` 为以下代码

```js
module.exports = (source) => {
    return `console.log('hello markdown loader')`;
}
```

则生成的产物如下

- 可以看到 return 的 js 代码只是被拼到了 module 中

```js
(function(modules) {
    /* ... */
})([
    function(module, __webpack_exports__, __webpack_require__) {},
    function(module, exports) {
        console.log('hello markdown loader')
    }
])
```

实现 loader 逻辑

- 使用第三方包 `marked` 将 markdown 转换为 HTML 代码

```js
const { marked } = require('marked')

module.exports = (source) => {
    // 加载到模块的内容
    console.log(`[markdown-loader]:
                \n/*********/\n
                ${source}
                \n/*********/`);

    // 1.将 markdown 转换为 html 字符串
    const html = marked(source);

    // 2.将 html 字符串转换为 js 代码
    // 使用 JSON.stringify 保证换行符和引号会被转义，这样就不会有问题
    const code = `module.exports = ${JSON.stringify(html)}`;
    // 也可以使用 ESM 导出
    // const code = `export default ${JSON.stringify(html)}`;

    return code
}
```

> 也可以使用两个 loader，第一个 loader 将 md 转换为 html 字符串，第二个 loader 将 html 字符串转换为 js 代码
