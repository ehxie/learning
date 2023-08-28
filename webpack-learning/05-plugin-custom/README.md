# 自定义 plugin

plugin 机制其实就是钩子机制(webpack 中的事件)

- 插件就是往不同的钩子上挂载不同的任务

> [webpack hooks](https://v4.webpack.js.org/api/compiler-hooks/)

webpack 要求插件是一个函数或者包含 apply 方法的对象

## 需求

实现一个插件，用于删除打包后产物行首的注释，方便阅读

在 [webpack hooks](https://v4.webpack.js.org/api/compiler-hooks/) 中找到了 `emit` 事件，该事件在产物输出到 output 目录前调用，刚好符合我们的需求

- 我们可以通过 compiler 对象的 hooks 属性访问到 emit 钩子，再通过 tap 方法注册一个钩子函数
  - tap 方法接收两个参数：第一个是插件的名称，第二个是挂载到这个钩子上的函数

实现插件

```js
module.exports = class RemoveCommentsPlugin {
    apply(compiler) {
        compiler.hooks.emit.tap('RemoveCommentsPlugin', compilation => {
            for (const name in compilation.assets) {
                // 只处理 js 文化
                if (name.endsWith('.js')) {
                    // 文件内容
                    const content = compilation.assets[name].source();
                    // 去除注释
                    const noComments = content.replace(/\/\*{2,}\/\s?/g, "")
                    // 修改产物
                    compilation.assets[name] = {
                        source: () => noComments,
                        size: () => noComments.length
                    }
                }
            }
        })
    }
}
```

执行打包后打开产物 `dist/main.js` 可以发现前面的注释都没了

```shell
npm run build:pluginCustom
```

## 总结

插件的实现机制其实是面向切面编程(AOP)

- webpack 为每个工作环节都预留了合适的钩子，扩展时只需要找到合适的时机请做合适的事情
