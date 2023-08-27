
# webpack 学习

## 版本

- webpack 4

- webpack-cli 3

## 目录

[00-base](/webpack-learning/00-base/)

- 浏览器中使用 ES Modules

[01-start](/webpack-learning/01-start/README.md)

- webpack 的基本使用以及打包产物的分析
- webpack 工作模式的配置（产物是否进行编译优化）
- 如何让 webpack 配置文件有代码提示

# 前置知识

## 解决问题

如何在前端项目中更高效的管理和维护项目中的每一个**资源**

## 模块化的演进过程

早期的前端技术标准并没有预料到前端有现在的技术规模，所以设计上存在很多缺陷，导致我们实现前端模块化时会出现很多问题

### 1、基于文件划分的方式

```js
- stage
 |- module-a.js
 |- module-b.js
 |- index.html
```

`module-a.js`

```js
function foo() {
    console.log('foo')
}
```

在 `index.html` 中通过 `script` 标签引入模块

```html
<body>
    <script scr="./module-a.js"></script>
    <script scr="./module-b.js"></script>
    <script>
        // 使用
        foo()
    </script>
</body>
```

存在问题：

- 模块在全局工作，大量模块成员污染全局作用域
- 没有私有空间，所有模块内的成员可以在模块外部被访问和修改
- 一旦模块增多，很容易造成命名冲突
- 无法管理模块与模块之间的关系
- 在维护过程中也无法分辨变量来自哪个模块（例如以上代码中不知道 foo 是来自 module-a.js 还是 module-b.js）

### 2、基于命名空间的方式

`module-a.js`

```js
window.moduleA = {
    foo: function() {
        console.log('foo')
    }
}
```

`index.html`

```html
<body>
    <script scr="./module-a.js"></script>
    <script scr="./module-b.js"></script>
    <script>
        // 使用
        moduleA.foo()
    </script>
</body>
```

这种方式只解决了命名冲突，其他的问题都还是存在

### 3、IIFE

`module-a.js`

```js
// 可以通过参数显示声明所依赖的模块
;(function($) {
    // 私有变量
    let name = 'module-a'

    window.moduleA = {
        foo: function() {
            console.log('foo')
        }
    }
})(jQuery)
```

`index.html`

```html
<body>
    <script src="https://unpkg.com/jquery"></script>
    <script scr="./module-a.js"></script>
    <script scr="./module-b.js"></script>
    <script>
        // 使用
        moduleA.foo()
    </script>
</body>
```

优点：

- 在命名空间的基础上解决了**私有变量**的问题和**模块依赖**的问题

不足：

- 没有解决模块加载的问题
  - 什么时候加载，需要加载哪些模块等

理想的情况:

- 在页面中引入一个入口 JS 文件，其余用到的模块可以通过代码控制（按需加载）

- 但是通过约定实现模块化的方式，在不同的开发者之间都会有细微的差别，为了统一不同开发者，不同项目之间的差异，模块化规范出现了

### 4、模块化规范的出现

需求

- 一个统一的模块化标准

- 一个可以自动加载模块的基础库

#### CommonJS 规范

NodeJS 中的所遵循的规范

- 规定每个文件就是一个模块，每个模块都有自己的作用域

- 通过 module.exports 导出成员，通过 require 载入模块

> 以**同步**的方式加载模块
>
> - 在启动时加载模块，在代码运行中只是使用模块
>
> - 如果是在浏览器中使用这种模式，则会引起大量同步模式的请求，导致应用运行效率低

#### AMD

由于同步机制，所以早期指定模块化时前端并没有使用 CommonJS，而是专门为浏览器设计一个 AMD(Asynchronous Module Definition) 规范，即异步模块规范

- 模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行

> 同期推出了 Require.js 实现了 AMD 规范，本身也是一个非常强大的模块加载器

```js
// AMD 规范定义一个模块
// - 第一个参数是所依赖的模块
// - 第二个参数是一个函数，参数是依赖的模块，通过该函数的 return 向外暴露一些成员
define(['jQuery', './module2.js'], function($, module2) {
    return {
        start: function() {
            $('body').animate({ margin: '200px' })
            module2()
        }
    }
})


// AMD 模块加载模块
// - 内部会自动帮我们创建一个 script 标签去请求和执行所对应的代码
require(['./modules/module1.js'], function(module1) {
    module1.start()
})
```

#### 模块化最佳实践的统一

- 在 NodeJS 环境中使用 CommonJS 规范
- 在浏览器环境中使用 ESM 规范（ES Modules）
  - 在 ECMAScript2015(ES6) 中引入的，存在环境兼容问题
  - ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，旨在成为浏览器和服务器通用的模块解决方案

> ESM 特征：
>
> - 严格模式：ES6 的模块自动采用严格模式
>
> - import read-only特性： import的属性是只读的，不能赋值，类似于const的特性
>
> - export/import提升： import/export必须位于模块顶级，不能位于作用域内；其次对于模块内的import/export会提升到模块顶部，这是在编译阶段完成的

#### 模块编译打包工具

模块化的出现划分出了很多的模块文件，前端应用运行在浏览器中，每个文件都需要单独从服务器中请求过来

- 如果模块太多，则会发送很多请求，影响效率，所以**模块化打包工具**应运而生

需求：

- 将新特效的的代码转换为兼容大多数浏览器的代码
- 将分散的模块打包成一个
- 可以处理不同种类的模块(`.js`、`.css`、`.less`、`.png` 等等资源文件)

webpack 就能满足上面的模块打包
