# start

webpack 如何把代码打包起来的

## 打包结果分析

> 打开控制台单步调试即可了解整个过程

执行命令

```js
npm run build:start
```

查看打包后结果 `./dist/main.bundle.js`

1.结构

- 可以看到打包后的结果是一个 IIFE
  - 参数是一个数组，数组的元素是参数相同的函数，两个元素对应者我们代码中 import 的两个 js 文件

```js
(function (modules) {
    /* ... */
})(
    [
        function (module, __webpack_exports__, __webpack_require__) { /* ... */ },
        function (module, __webpack_exports__, __webpack_require__) { /* ... */ },
    ]
)
```

2.分析 IIFE 执行的函数的作用

```js
(function (modules) {
    // 缓存
    var installedModules = {}

    // 1.定义 require 函数，用于导入 JS 文件
    function __webpack_require__(moduleId) {
        // 读缓存
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports
        }

        // 没有缓存则定义一个 module 并写入缓存
        var module = installedModules[moduleId] = {
            // module 的 id
            i: moduleId,
            // 标记是否加载完成(load)
            l: false,
            // js 模块
            exports: {}
        };

        // 执行模块（后面说明）
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

        // 模块加载完成
        module.l = true;

        // 把模块返回回去
        return module.exports
    }

    // 给 require 函数上绑定各种属性和方法
    // 不重要，略

    // 2.加载第一个模块
    return __webpack_require__(__webpack_require__.s = 0);
})(
    [ /* 参数先省略 */ ]
)

```

3.参数中的函数

- 每个函数其实里面包着的都是 js 文件中的代码

```js
(function(modules){
    /* ... */
})(
    [
/* 0 */
    (function (module, __webpack_exports__, __webpack_require__) {
        "use strict";
        // 为 __webpack_exports__ 增加一个 __esModule 用于标识这是一个 es 模块
        __webpack_require__.r(__webpack_exports__);

        // 对应原文件中 import createHeading from "./heading.js";
        // - 将 createHeading 改为了 _heading_js__WEBPACK_IMPORTED_MODULE_0__
        // - import 改为了上面定义的 require 函数进行导入
        var _heading_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1); // 这里导入模块 1

        // 对应原文件中的 const heading = createHeading()
        const heading = Object(_heading_js__WEBPACK_IMPORTED_MODULE_0__["default"])()

        // 这句和源文件中的一样
        document.body.append(heading)
    }),
/* 1 */
    (function (module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        // 对应着  export default () =>{ /* ... */ }
        __webpack_exports__["default"] = (() => {
            const element = document.createElement('h2')
            element.innerHTML = 'Hello Webpack'
            return element
        });
    })
]
)
```

## webpack 配置相关

1. webpack 配置文件代码提示

- NodeJS 使用的是 CJS，所以在运行代码时需要把类型提示注释掉

```js

// 配置文件类型提示，编写配置时打开可以有提示
// import { Configuration } from 'webpack'

/**
 * @type {Configuration}
 */
const config = {
    // ...
}

module.exports = config
```

2.三种不同的工作模式

- production
  - 启动内置优化插件，自动优化**打包结果**，打包速度偏慢

- development
  - 自动优化打包速度，添加一些调试过程中的辅助插件以便于更好的调试错误

- none
  - 运行最原始的打包，不做任何处理，这种模式一般在我们需要分析打包结果时使用

使用方式一：在配置文件中配置

```js
const config = {
    mode: 'none',
}

module.exports = config
```

使用方式2：在命令行中配置

```shell
npx webpack --mode none
```
